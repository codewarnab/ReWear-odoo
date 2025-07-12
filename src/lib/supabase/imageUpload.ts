import { createClient } from './client'

// Types for image upload functionality
export interface ImageUploadOptions {
  /** The name of the Supabase storage bucket */
  bucketName: string
  /** Optional folder path within the bucket (e.g., 'user-uploads' or 'products/images') */
  folderPath?: string
  /** Whether to replace existing files with the same name (default: false) */
  upsert?: boolean
  /** Maximum file size in bytes (default: 5MB) */
  maxSizeBytes?: number
  /** Allowed file extensions (default: ['jpg', 'jpeg', 'png', 'gif', 'webp']) */
  allowedExtensions?: string[]
  /** Allowed MIME types (default: image types) */
  allowedMimeTypes?: string[]
}

export interface ImageUploadResult {
  /** The original file that was uploaded */
  file: File
  /** Success status of the upload */
  success: boolean
  /** Public URL of the uploaded image (if successful) */
  url?: string
  /** Full path of the uploaded file in the bucket */
  path?: string
  /** Error message if upload failed */
  error?: string
  /** File validation details */
  validation?: {
    isValidExtension: boolean
    isValidMimeType: boolean
    isValidSize: boolean
    detectedExtension?: string
    detectedMimeType?: string
    fileSizeBytes?: number
  }
}

export interface BulkImageUploadResult {
  /** Array of individual upload results */
  results: ImageUploadResult[]
  /** Number of successful uploads */
  successCount: number
  /** Number of failed uploads */
  failureCount: number
  /** Total number of files processed */
  totalCount: number
  /** Array of successfully uploaded file URLs */
  successfulUrls: string[]
  /** Array of error messages from failed uploads */
  errors: string[]
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  file: File
  detectedExtension: string
  detectedMimeType: string
  fileSizeBytes: number
}

/**
 * Validates a file for image upload based on extension, MIME type, and size
 * 
 * @param file - File object to validate
 * @param options - Validation options
 * @returns FileValidationResult - Detailed validation result
 * 
 * @example
 * ```typescript
 * const file = fileInput.files[0];
 * const validation = validateImageFile(file, {
 *   maxSizeBytes: 5 * 1024 * 1024, // 5MB
 *   allowedExtensions: ['jpg', 'png'],
 *   allowedMimeTypes: ['image/jpeg', 'image/png']
 * });
 * 
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export function validateImageFile(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): FileValidationResult {
  const {
    maxSizeBytes = 5 * 1024 * 1024, // 5MB default
    allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png', 
      'image/gif',
      'image/webp'
    ]
  } = options

  const errors: string[] = []
  
  // Extract file extension (case-insensitive)
  const fileName = file.name.toLowerCase()
  const detectedExtension = fileName.split('.').pop() || ''
  const detectedMimeType = file.type
  const fileSizeBytes = file.size

  // 1. Validate file extension using regex pattern (following web best practices)
  const extensionRegex = new RegExp(`\\.(${allowedExtensions.join('|')})$`, 'i')
  const isValidExtension = extensionRegex.test(fileName)
  
  if (!isValidExtension) {
    errors.push(`Invalid file extension. Allowed: ${allowedExtensions.join(', ')}. Found: ${detectedExtension}`)
  }

  // 2. Validate MIME type (critical for security as per web standards)
  const isValidMimeType = allowedMimeTypes.includes(detectedMimeType)
  
  if (!isValidMimeType) {
    errors.push(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}. Found: ${detectedMimeType}`)
  }

  // 3. Validate file size
  const isValidSize = fileSizeBytes <= maxSizeBytes
  
  if (!isValidSize) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1)
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1)
    errors.push(`File too large. Maximum: ${maxSizeMB}MB. Found: ${fileSizeMB}MB`)
  }

  // 4. Additional security check: ensure MIME type matches extension
  const extensionMimeMap: Record<string, string[]> = {
    'jpg': ['image/jpeg', 'image/jpg'],
    'jpeg': ['image/jpeg', 'image/jpg'],
    'png': ['image/png'],
    'gif': ['image/gif'],
    'webp': ['image/webp']
  }

  const expectedMimeTypes = extensionMimeMap[detectedExtension] || []
  if (expectedMimeTypes.length > 0 && !expectedMimeTypes.includes(detectedMimeType)) {
    errors.push(`File extension and type mismatch. Extension "${detectedExtension}" should have type: ${expectedMimeTypes.join(' or ')}. Found: ${detectedMimeType}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    file,
    detectedExtension,
    detectedMimeType,
    fileSizeBytes
  }
}

/**
 * Validates multiple files for image upload
 * 
 * @param files - Array of File objects to validate
 * @param options - Validation options
 * @returns Array of FileValidationResult
 */
export function validateImageFiles(
  files: File[],
  options: Partial<ImageUploadOptions> = {}
): FileValidationResult[] {
  return files.map(file => validateImageFile(file, options))
}

/**
 * Uploads multiple images to a Supabase storage bucket with comprehensive validation
 * 
 * @param images - Array of File objects to upload
 * @param options - Configuration options for the upload
 * @param options.bucketName - The name of the Supabase storage bucket
 * @param options.folderPath - Optional folder path within the bucket
 * @param options.upsert - Whether to replace existing files with the same name
 * @param options.maxSizeBytes - Maximum file size in bytes (default: 5MB)
 * @param options.allowedExtensions - Allowed file extensions
 * @param options.allowedMimeTypes - Allowed MIME types
 * 
 * @returns Promise<BulkImageUploadResult> - Object containing upload results and metadata
 * 
 * @example
 * ```typescript
 * const files = Array.from(fileInput.files);
 * const result = await uploadImagesToBucket(files, {
 *   bucketName: 'user-uploads',
 *   folderPath: 'profile-pictures',
 *   maxSizeBytes: 2 * 1024 * 1024, // 2MB
 *   allowedExtensions: ['jpg', 'png'],
 *   upsert: false
 * });
 * 
 * console.log(`Uploaded ${result.successCount} out of ${result.totalCount} files`);
 * result.errors.forEach(error => console.error('Error:', error));
 * ```
 */
export async function uploadImagesToBucket(
  images: File[],
  options: ImageUploadOptions
): Promise<BulkImageUploadResult> {
  const supabase = createClient()
  const { bucketName, folderPath = '', upsert = false } = options
  
  // Validate inputs
  if (!images || images.length === 0) {
    throw new Error('No images provided for upload')
  }
  
  if (!bucketName || bucketName.trim() === '') {
    throw new Error('Bucket name is required')
  }

  // Validate that all items are File objects
  const invalidFiles = images.filter(file => !(file instanceof File))
  if (invalidFiles.length > 0) {
    throw new Error(`Invalid file objects detected. Expected File instances, got: ${invalidFiles.map(f => typeof f).join(', ')}`)
  }

  const results: ImageUploadResult[] = []
  
  // Process each image upload with validation
  for (const file of images) {
    try {
      // Comprehensive file validation (following web security best practices)
      const validation = validateImageFile(file, options)
      
      if (!validation.isValid) {
        results.push({
          file,
          success: false,
          error: `Validation failed: ${validation.errors.join('; ')}`,
          validation: {
            isValidExtension: false,
            isValidMimeType: false,
            isValidSize: false,
            detectedExtension: validation.detectedExtension,
            detectedMimeType: validation.detectedMimeType,
            fileSizeBytes: validation.fileSizeBytes
          }
        })
        continue
      }

      // Generate unique filename to avoid conflicts
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = validation.detectedExtension
      const cleanFileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9-_]/g, '_')
      const fileName = `${cleanFileName}_${timestamp}_${randomString}.${fileExtension}`
      
      // Construct the full path
      const fullPath = folderPath 
        ? `${folderPath.replace(/^\/+|\/+$/g, '')}/${fileName}` 
        : fileName

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert,
        })

      if (error) {
        results.push({
          file,
          success: false,
          error: error.message,
          validation: {
            isValidExtension: true,
            isValidMimeType: true,
            isValidSize: true,
            detectedExtension: validation.detectedExtension,
            detectedMimeType: validation.detectedMimeType,
            fileSizeBytes: validation.fileSizeBytes
          }
        })
        continue
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path)

      results.push({
        file,
        success: true,
        url: urlData.publicUrl,
        path: data.path,
        validation: {
          isValidExtension: true,
          isValidMimeType: true,
          isValidSize: true,
          detectedExtension: validation.detectedExtension,
          detectedMimeType: validation.detectedMimeType,
          fileSizeBytes: validation.fileSizeBytes
        }
      })

    } catch (err) {
      results.push({
        file,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      })
    }
  }

  // Calculate summary statistics
  const successfulResults = results.filter(r => r.success)
  const failedResults = results.filter(r => !r.success)
  
  return {
    results,
    successCount: successfulResults.length,
    failureCount: failedResults.length,
    totalCount: images.length,
    successfulUrls: successfulResults.map(r => r.url!),
    errors: failedResults.map(r => r.error!),
  }
}

/**
 * Uploads a single image to a Supabase storage bucket with validation
 * 
 * @param image - File object to upload
 * @param options - Configuration options for the upload
 * 
 * @returns Promise<ImageUploadResult> - Object containing upload result
 * 
 * @example
 * ```typescript
 * const file = fileInput.files[0];
 * 
 * // Validate before upload (optional - upload function validates automatically)
 * const validation = validateImageFile(file, {
 *   maxSizeBytes: 2 * 1024 * 1024,
 *   allowedExtensions: ['jpg', 'png']
 * });
 * 
 * if (!validation.isValid) {
 *   console.error('Invalid file:', validation.errors);
 *   return;
 * }
 * 
 * const result = await uploadImageToBucket(file, {
 *   bucketName: 'user-uploads',
 *   folderPath: 'profile-pictures'
 * });
 * 
 * if (result.success) {
 *   console.log('Image uploaded:', result.url);
 * } else {
 *   console.error('Upload failed:', result.error);
 * }
 * ```
 */
export async function uploadImageToBucket(
  image: File,
  options: ImageUploadOptions
): Promise<ImageUploadResult> {
  const result = await uploadImagesToBucket([image], options)
  return result.results[0]
} 
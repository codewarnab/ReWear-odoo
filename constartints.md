| constraint_name                           | table_name         | check_clause                                                                                                         |
| ----------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| clothing_items_exchange_preference_check  | clothing_items     | (exchange_preference = ANY (ARRAY['swap_only'::text, 'points_only'::text, 'both'::text]))                            |
| clothing_items_status_check               | clothing_items     | (status = ANY (ARRAY['pending_approval'::text, 'listed'::text, 'swapped'::text, 'redeemed'::text, 'removed'::text])) |
| clothing_items_approval_status_check      | clothing_items     | (approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))                                 |
| admin_actions_target_type_check           | admin_actions      | (target_type = ANY (ARRAY['item'::text, 'user'::text, 'transaction'::text]))                                         |
| swap_transactions_status_check            | swap_transactions  | (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'cancelled'::text, 'completed'::text]))    |
| point_transactions_transaction_type_check | point_transactions | (transaction_type = ANY (ARRAY['redemption'::text, 'earned'::text, 'bonus'::text, 'refund'::text]))                  |
| point_transactions_status_check           | point_transactions | (status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text]))                                        |
| admin_actions_action_type_check           | admin_actions      | (action_type = ANY (ARRAY['approve_item'::text, 'reject_item'::text, 'remove_item'::text, 'suspend_user'::text]))    |
| reported_items_reason_check               | reported_items     | (reason = ANY (ARRAY['inappropriate_content'::text, 'fake_item'::text, 'spam'::text, 'other'::text]))                |
| reported_items_status_check               | reported_items     | (status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text, 'dismissed'::text]))                       |
| 2200_17268_1_not_null                     | users_profiles     | id IS NOT NULL                                                                                                       |
| 2200_17289_1_not_null                     | categories         | id IS NOT NULL                                                                                                       |
| 2200_17289_2_not_null                     | categories         | name IS NOT NULL                                                                                                     |
| 2200_17289_3_not_null                     | categories         | slug IS NOT NULL                                                                                                     |
| 2200_17309_1_not_null                     | clothing_items     | id IS NOT NULL                                                                                                       |
| 2200_17309_3_not_null                     | clothing_items     | title IS NOT NULL                                                                                                    |
| 2200_17343_1_not_null                     | swap_transactions  | id IS NOT NULL                                                                                                       |
| 2200_17375_1_not_null                     | point_transactions | id IS NOT NULL                                                                                                       |
| 2200_17375_4_not_null                     | point_transactions | transaction_type IS NOT NULL                                                                                         |
| 2200_17375_5_not_null                     | point_transactions | points_amount IS NOT NULL                                                                                            |
| 2200_17397_1_not_null                     | user_favorites     | id IS NOT NULL                                                                                                       |
| 2200_17416_1_not_null                     | admin_actions      | id IS NOT NULL                                                                                                       |
| 2200_17416_3_not_null                     | admin_actions      | action_type IS NOT NULL                                                                                              |
| 2200_17416_4_not_null                     | admin_actions      | target_type IS NOT NULL                                                                                              |
| 2200_17416_5_not_null                     | admin_actions      | target_id IS NOT NULL                                                                                                |
| 2200_17432_1_not_null                     | reported_items     | id IS NOT NULL                                                                                                       |
| 2200_17432_4_not_null                     | reported_items     | reason IS NOT NULL                                                                                                   |
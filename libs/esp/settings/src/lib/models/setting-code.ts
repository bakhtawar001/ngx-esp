export type CompanyProfile =
  | 'name'
  | 'email'
  | 'replyto'
  | 'phone'
  | 'website'
  | 'signature'
  | 'allow_custom_signature'
  | 'address'
  | 'third_party_system_name'
  | 'third_party_record_option'
  | 'disable_payment'
  | 'allow_edit_order_number'
  | 'allow_line_item_status'
  | 'default_salesperson'
  | 'allow_reorder_types'
  | 'primary_brand_color'
  | 'allow_order_inquiry'
  | 'order_inquiry_option'
  | 'order_inquiry_user';
type CompanyProfileSettings = `company_profile.${CompanyProfile}`;

export type SettingCode = CompanyProfileSettings;

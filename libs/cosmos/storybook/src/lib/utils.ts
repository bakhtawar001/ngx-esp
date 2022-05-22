type ControlTypes = 'text' | 'boolean' | 'color' | 'number';

export const arg = (name: string, control: ControlTypes = 'text') => ({
  name,
  control,
});

export const Template = (template: string) => (args: any) => ({
  template,
  args,
});

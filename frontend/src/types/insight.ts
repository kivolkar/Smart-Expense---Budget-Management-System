export interface Insight {
  type: 'warning' | 'alert' | 'success';
  title: string;
  message: string;
}

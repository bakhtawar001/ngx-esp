import { <%=capitalize(name)%> } from '../models';

export interface <%=capitalize(name)%>StateModel {
  error: string | null;
  pending: boolean;
  <%=camelize(name)%>: <%=capitalize(name)%>;
}

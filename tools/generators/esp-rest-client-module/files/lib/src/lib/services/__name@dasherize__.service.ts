import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';
import { } from <>;

%=capitalize(name)%> } from '../models';

@Injectable({
  providedIn: 'root',
})
export class <%=capitalize(name)%>Service extends RestClient<<%=capitalize(name)%>> {
  url = '<%=name%>';
}

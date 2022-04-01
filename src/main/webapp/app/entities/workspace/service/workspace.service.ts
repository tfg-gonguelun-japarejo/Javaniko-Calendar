import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkspace, getWorkspaceIdentifier, Workspace } from '../workspace.model';
import { IProyect } from 'app/entities/proyect/proyect.model';

export type EntityResponseType = HttpResponse<IWorkspace>;
export type EntityArrayResponseType = HttpResponse<IWorkspace[]>;

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/workspaces');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(workspace: IWorkspace): Observable<EntityResponseType> {
    return this.http.post<IWorkspace>(this.resourceUrl, workspace, { observe: 'response' });
  }

  update(workspace: IWorkspace): Observable<EntityResponseType> {
    return this.http.put<IWorkspace>(`${this.resourceUrl}/${getWorkspaceIdentifier(workspace) as number}`, workspace, {
      observe: 'response',
    });
  }

  partialUpdate(workspace: IWorkspace): Observable<EntityResponseType> {
    return this.http.patch<IWorkspace>(`${this.resourceUrl}/${getWorkspaceIdentifier(workspace) as number}`, workspace, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkspace>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkspace[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWorkspaceToCollectionIfMissing(
    workspaceCollection: IWorkspace[],
    ...workspacesToCheck: (IWorkspace | null | undefined)[]
  ): IWorkspace[] {
    const workspaces: IWorkspace[] = workspacesToCheck.filter(isPresent);
    if (workspaces.length > 0) {
      const workspaceCollectionIdentifiers = workspaceCollection.map(workspaceItem => getWorkspaceIdentifier(workspaceItem)!);
      const workspacesToAdd = workspaces.filter(workspaceItem => {
        const workspaceIdentifier = getWorkspaceIdentifier(workspaceItem);
        if (workspaceIdentifier == null || workspaceCollectionIdentifiers.includes(workspaceIdentifier)) {
          return false;
        }
        workspaceCollectionIdentifiers.push(workspaceIdentifier);
        return true;
      });
      return [...workspacesToAdd, ...workspaceCollection];
    }
    return workspaceCollection;
  }

  getGithubOrg(name: string): Observable<IWorkspace[]> {
    const url = 'https://api.github.com/users/' + name + '/orgs';
    return this.http.get<IWorkspace[]>(url);
  }

  getGithubProyects(url: string): Observable<IProyect[]> {
    return this.http.get<IProyect[]>(url);
  }
}

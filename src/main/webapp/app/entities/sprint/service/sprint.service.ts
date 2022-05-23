import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISprint, getSprintIdentifier } from '../sprint.model';
import { IProyect } from 'app/entities/proyect/proyect.model';

export type EntityResponseType = HttpResponse<ISprint>;
export type EntityArrayResponseType = HttpResponse<ISprint[]>;

@Injectable({ providedIn: 'root' })
export class SprintService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/sprints');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(sprint: ISprint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sprint);
    return this.http
      .post<ISprint>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sprint: ISprint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sprint);
    return this.http
      .put<ISprint>(`${this.resourceUrl}/${getSprintIdentifier(sprint) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sprint: ISprint): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sprint);
    return this.http
      .patch<ISprint>(`${this.resourceUrl}/${getSprintIdentifier(sprint) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISprint>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISprint[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSprintToCollectionIfMissing(sprintCollection: ISprint[], ...sprintsToCheck: (ISprint | null | undefined)[]): ISprint[] {
    const sprints: ISprint[] = sprintsToCheck.filter(isPresent);
    if (sprints.length > 0) {
      const sprintCollectionIdentifiers = sprintCollection.map(sprintItem => getSprintIdentifier(sprintItem)!);
      const sprintsToAdd = sprints.filter(sprintItem => {
        const sprintIdentifier = getSprintIdentifier(sprintItem);
        if (sprintIdentifier == null || sprintCollectionIdentifiers.includes(sprintIdentifier)) {
          return false;
        }
        sprintCollectionIdentifiers.push(sprintIdentifier);
        return true;
      });
      return [...sprintsToAdd, ...sprintCollection];
    }
    return sprintCollection;
  }

  getGithubMilestones(url: string): Observable<ISprint[]> {
    return this.http.get<ISprint[]>(url);
  }

  findProyectsByUsuarioId(usuarioId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IProyect[]>(`${this.resourceUrl}/usuario?usuarioId=${usuarioId}`, { observe: 'response' });
  }

  protected convertDateFromClient(sprint: ISprint): ISprint {
    return Object.assign({}, sprint, {
      createdAt: sprint.createdAt?.isValid() ? sprint.createdAt.format(DATE_FORMAT) : undefined,
      dueOn: sprint.dueOn?.isValid() ? sprint.dueOn.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt ? dayjs(res.body.createdAt) : undefined;
      res.body.dueOn = res.body.dueOn ? dayjs(res.body.dueOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sprint: ISprint) => {
        sprint.createdAt = sprint.createdAt ? dayjs(sprint.createdAt) : undefined;
        sprint.dueOn = sprint.dueOn ? dayjs(sprint.dueOn) : undefined;
      });
    }
    return res;
  }
}

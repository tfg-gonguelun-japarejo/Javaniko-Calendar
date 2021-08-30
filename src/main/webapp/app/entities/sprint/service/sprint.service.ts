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

  protected convertDateFromClient(sprint: ISprint): ISprint {
    return Object.assign({}, sprint, {
      startDate: sprint.startDate?.isValid() ? sprint.startDate.format(DATE_FORMAT) : undefined,
      endDate: sprint.endDate?.isValid() ? sprint.endDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sprint: ISprint) => {
        sprint.startDate = sprint.startDate ? dayjs(sprint.startDate) : undefined;
        sprint.endDate = sprint.endDate ? dayjs(sprint.endDate) : undefined;
      });
    }
    return res;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProyect, getProyectIdentifier } from '../proyect.model';

export type EntityResponseType = HttpResponse<IProyect>;
export type EntityArrayResponseType = HttpResponse<IProyect[]>;

@Injectable({ providedIn: 'root' })
export class ProyectService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/proyects');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(proyect: IProyect): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proyect);
    return this.http
      .post<IProyect>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(proyect: IProyect): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proyect);
    return this.http
      .put<IProyect>(`${this.resourceUrl}/${getProyectIdentifier(proyect) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(proyect: IProyect): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(proyect);
    return this.http
      .patch<IProyect>(`${this.resourceUrl}/${getProyectIdentifier(proyect) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProyect>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProyect[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProyectToCollectionIfMissing(proyectCollection: IProyect[], ...proyectsToCheck: (IProyect | null | undefined)[]): IProyect[] {
    const proyects: IProyect[] = proyectsToCheck.filter(isPresent);
    if (proyects.length > 0) {
      const proyectCollectionIdentifiers = proyectCollection.map(proyectItem => getProyectIdentifier(proyectItem)!);
      const proyectsToAdd = proyects.filter(proyectItem => {
        const proyectIdentifier = getProyectIdentifier(proyectItem);
        if (proyectIdentifier == null || proyectCollectionIdentifiers.includes(proyectIdentifier)) {
          return false;
        }
        proyectCollectionIdentifiers.push(proyectIdentifier);
        return true;
      });
      return [...proyectsToAdd, ...proyectCollection];
    }
    return proyectCollection;
  }

  protected convertDateFromClient(proyect: IProyect): IProyect {
    return Object.assign({}, proyect, {
      startDate: proyect.startDate?.isValid() ? proyect.startDate.format(DATE_FORMAT) : undefined,
      endDate: proyect.endDate?.isValid() ? proyect.endDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((proyect: IProyect) => {
        proyect.startDate = proyect.startDate ? dayjs(proyect.startDate) : undefined;
        proyect.endDate = proyect.endDate ? dayjs(proyect.endDate) : undefined;
      });
    }
    return res;
  }
}

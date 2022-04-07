import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInput, getInputIdentifier } from '../input.model';

export type EntityResponseType = HttpResponse<IInput>;
export type EntityArrayResponseType = HttpResponse<IInput[]>;

@Injectable({ providedIn: 'root' })
export class InputService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/inputs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(input: IInput): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(input);
    return this.http
      .post<IInput>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(input: IInput): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(input);
    return this.http
      .put<IInput>(`${this.resourceUrl}/${getInputIdentifier(input) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(input: IInput): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(input);
    return this.http
      .patch<IInput>(`${this.resourceUrl}/${getInputIdentifier(input) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IInput>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IInput[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInputToCollectionIfMissing(inputCollection: IInput[], ...inputsToCheck: (IInput | null | undefined)[]): IInput[] {
    const inputs: IInput[] = inputsToCheck.filter(isPresent);
    if (inputs.length > 0) {
      const inputCollectionIdentifiers = inputCollection.map(inputItem => getInputIdentifier(inputItem)!);
      const inputsToAdd = inputs.filter(inputItem => {
        const inputIdentifier = getInputIdentifier(inputItem);
        if (inputIdentifier == null || inputCollectionIdentifiers.includes(inputIdentifier)) {
          return false;
        }
        inputCollectionIdentifiers.push(inputIdentifier);
        return true;
      });
      return [...inputsToAdd, ...inputCollection];
    }
    return inputCollection;
  }

  protected convertDateFromClient(input: IInput): IInput {
    return Object.assign({}, input, {
      inputDate: input.inputDate?.isValid() ? input.inputDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.inputDate = res.body.inputDate ? dayjs(res.body.inputDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((input: IInput) => {
        input.inputDate = input.inputDate ? dayjs(input.inputDate) : undefined;
      });
    }
    return res;
  }
}

import { Parser } from 'xml2js';
import { isArray, isNil, isNumber, isObject, isString } from 'lodash';

import * as Converters from './converters';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

export function fixJson(parametersSpec: any[], parameters: any) : any {

  const convertedParameters: any = {};

  if (!isNil(parameters)) {
    parametersSpec.forEach( (parameterSpec : any) => {
      if (parameters.hasOwnProperty(parameterSpec.name)) {
        const parameterValue = parameters[parameterSpec.name];
        switch (parameterSpec.type) {
          case 'string':
            if (typeof parameterValue === 'string') {
              convertedParameters[parameterSpec.name] = parameterValue;
            }
            else {
              // TODO - or should it be null?
              convertedParameters[parameterSpec.name] = '';
            }
            break;
          case 'boolean':
            convertedParameters[parameterSpec.name] = Converters.stringToBool(parameterValue);
            break;
          case 'number':
            convertedParameters[parameterSpec.name] = Converters.stringToNumber(parameterValue);
            break;
        }
      }
    });
  }

  return convertedParameters;
}

export function isXml(buf : Buffer) : Promise<boolean> {
  return new Promise( (resolve) => {
    stringToJson(buf).then( () => {
      resolve(true);
      return;
    }).catch(() => {
      resolve(false);
      return;
    });
  });
}

export function fixString(rawValue : any) : string {
  if (typeof rawValue === 'string') {
    return rawValue;
  }
  return '';
}

export function getParameterArray(rawParameters: any) : any[] {
  if (Array.isArray(rawParameters)) {
    return rawParameters;
  }
  else if (isNil(rawParameters)) {
    return [];
  }
  return [rawParameters];
}

export function stringToJson(buf : Buffer) : any {

  return new Promise( (resolve, reject) => {
    try {
      const parser = new Parser({
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true
      });
      parser.parseString(buf, (err: any, json: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(json);
        return;
      });
    } catch (parseErr) {
      reject(parseErr);
      return;
    }
  });
}


import { isArray, isNil, isNumber, isObject, isString } from 'lodash';

import {
  fixJson,
  getParameterArray,
  stringToJson
} from './helpers';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

import {
  fixMetadata,
} from './bpfPresentationPropertiesToJson';

import {
  fixZones
} from './bpfZonesToJson';

export function bpfToJson(xmlBPF : any) : any {

  return new Promise( (resolve) => {
    stringToJson(xmlBPF).then( (jsonBPF: any) => {
      const bpf : any = fixJsonBPF(jsonBPF);
      resolve(bpf);
    });
  });
}

function fixJsonBPF(rawBPF : any) : any {

  const bpf : any = {};

  const rawBrightAuthor : any = rawBPF.BrightAuthor;
  if (isNil(rawBrightAuthor) || isNil(rawBrightAuthor.$) || isNil(rawBrightAuthor.meta)) {
    throw new BpfConverterError(BpfConverterErrorType.errorNotAValidBpf,
      'fixJsonBPF: not a valid bpf file');
  }
  const rawPresentationParameters : any = rawBrightAuthor.$;
  const rawMetadata = rawBrightAuthor.meta;
  const rawZones = getParameterArray(rawBrightAuthor.zones);

  bpf.presentationParameters = fixPresentationParameters(rawPresentationParameters);
  validateIsSupportedBpf(bpf.presentationParameters);
  
  bpf.metadata = fixMetadata(rawMetadata);
  bpf.zones = fixZones(rawZones);

  return bpf;
}

  // TODO - for now, minimum supported version is 6. This requires further investigation
  // TODO - review what is required to support the determination of a valid bpf
  function validateIsSupportedBpf(presentationParameters: any) {

  // validate that this is a bpf and that this conversion utility supports it.
  if (isNil(presentationParameters)
    || !isString(presentationParameters.BrightAuthorVersion)
    || !isString(presentationParameters.type)
    || (presentationParameters.type !== 'project')
    || !isNumber(presentationParameters.version)) {
    throw new BpfConverterError(BpfConverterErrorType.errorNotAValidBpf,
      'fixJsonBPF: not a valid bpf file');
  }
  if (presentationParameters.version < 6) {
    throw new BpfConverterError(BpfConverterErrorType.errorUnsupportedBpf,
      'fixJsonBPF: convert does not support this bpf version');
  }
}

// LOOKS OK
function fixPresentationParameters(rawPresentationParameters: any) : any {

  const presentationParametersSpec: any[] = [
    { name: 'BrightAuthorVersion', type: 'string'},
    { name: 'type', type: 'string'},
    { name: 'version', type: 'number'}
  ];

  return fixJson(presentationParametersSpec, rawPresentationParameters);
}

// LOOKS OK
export function fixUserVariables(rawUserVariablesSpec: any) : any {

  let userVariables : any[] = [];

  if (rawUserVariablesSpec && rawUserVariablesSpec.userVariable) {
    const rawUserVariables = getParameterArray(rawUserVariablesSpec.userVariable);
    userVariables = rawUserVariables.map( (rawUserVariable : any) : any => {
      const userVariable: any = fixUserVariable(rawUserVariable);
      return userVariable;
    });
  }

  return userVariables;
}

// TODO - should this live in this file. fixParameterValue (and perhaps other parameterValue functions) need it.
// LOOKS OK
export function fixUserVariable(rawUserVariable : any) : any {

  const userVariableConfigurationSpec: any [] = [
    { name: 'access', type: 'string'},
    { name: 'defaultValue', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'liveDataFeedName', type: 'string'},
    { name: 'networked', type: 'boolean'},
    { name: 'systemVariable', type: 'string'},
  ];

  const userVariable : any = fixJson(userVariableConfigurationSpec, rawUserVariable);
  return userVariable;
}

export function fixParameterValue(rawParameterValue : any) : any {

  const parameterValue : any = {};
  parameterValue.parameterValueItems = [];

  const rawParameterValueItems : any[] = rawParameterValue.$$;
  rawParameterValueItems.forEach( (rawParameterValueItem : any) => {

    switch (rawParameterValueItem['#name']) {
      case 'parameterValueItemText': {
        const parameterValueItem : any = {
          type : 'textValue',
          textValue : rawParameterValueItem.value
        };
        parameterValue.parameterValueItems.push(parameterValueItem);

        break;
      }
      case 'parameterValueItemUserVariable': {

        const rawUserVariable : any = rawParameterValueItem.userVariable;
        const userVariable : any = fixUserVariable(rawUserVariable);

        const parameterValueItem : any = {
          type : 'userVariable',
          userVariable
        };
        parameterValue.parameterValueItems.push(parameterValueItem);

        break;
      }
      // TODO - implement me
      case 'parameterValueItemMediaCounterVariable': {
        throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
          'fixParameterValue: parameterValueItemMediaCounterVariable not supported');
      }
    }
  });

  return parameterValue;
}


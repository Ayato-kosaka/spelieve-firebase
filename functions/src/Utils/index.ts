import * as core from 'express-serve-static-core';

export type exParamsDictionary<T> = T & core.ParamsDictionary;

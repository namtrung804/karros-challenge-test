type JSONValue = any | boolean | number | string | null | JSONObject ;

export interface JSONObject {
  [x: string]: JSONValue;
}


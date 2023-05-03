export interface DesignDataInterface {
  TABLES: {
    t_id: string;
    t_name: string;
    parent_tid: string;
    depth: number;
    allow_get: boolean;
    allow_list: boolean;
    allow_create: boolean;
    allow_update: boolean;
    allow_delete: boolean;
    memo: string;
  }[];
  T_COLUMNS: {
    t_id: string;
    c_no: number;
    c_name: string;
    c_datatype: string;
    c_length: number;
    c_required: boolean;
    c_updatable: boolean;
    memo: string;
  }[];
  INTERFACE: {
    func_id: string;
    i_prefix: string;
    i_no: number;
    func_name: string;
    i_name: string;
    i_required: boolean;
    i_type: string;
    memo: string;
  }[];
  CONST: {
    ServiceID: string;
    key: string;
    value: number;
  }[];
  RELATIONSHIPS: {
    table_from: string;
    symbol_from: string;
    symbol_to: string;
    table_to: string;
    FK: string;
  }[];
  SECURITY_RULES: {
    t_id: string;
    crud_type: string;
    method_no: number;
    method_type: string;
    func_id: string;
    extend_crud_type: string;
  }[];
  DATA_TYPE: {
    JSType: string;
    isPrimitive: boolean;
    Init: string;
    FirestoreType: string;
    RuleType: string;
    RuleInit: string;
  }[];
  FuncList: {
    Delete: string;
    ServiceName: string;
    ServiceID: string;
    FuncType: string;
    FuncTypeID: string;
    FuncNumber: string;
    FuncID: string;
    FuncName: string;
    Memo: string;
  }[];
  マスタ: {
    静的マスタ: string;
    動的マスタ: string;
  }[];
}

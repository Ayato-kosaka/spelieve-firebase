export interface DesignDataInterface {
  TABLES: {
    t_id: string;
    t_name: string;
    parent_tid: string;
    depth: string;
    allow_get: string;
    allow_list: string;
    allow_create: string;
    allow_update: string;
    allow_delete: string;
    memo: string;
  };
  T_COLUMNS: {
    t_id: string;
    c_no: string;
    c_name: string;
    c_datatype: string;
    c_length: string;
    c_required: string;
    c_updatable: string;
    memo: string;
  };
  INTERFACE: {
    func_id: string;
    i_prefix: string;
    i_no: string;
    func_name: string;
    i_name: string;
    i_required: string;
    i_type: string;
    memo: string;
  };
  CONST: { ServiceID: string; key: string; value: string };
  RELATIONSHIPS: {
    table_from: string;
    symbol_from: string;
    symbol_to: string;
    table_to: string;
    FK: string;
  };
  SECURITY_RULES: {
    t_id: string;
    crud_type: string;
    method_no: string;
    method_type: string;
    func_id: string;
    extend_crud_type: string;
  };
  DATA_TYPE: {
    JSType: string;
    isPrimitive: string;
    Init: string;
    FirestoreType: string;
    RuleType: string;
    RuleInit: string;
  };
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
  };
  マスタ: {
    静的マスタ: string;

    動的マスタ: string;
  };
}
[];

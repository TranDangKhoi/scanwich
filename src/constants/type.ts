export const TOKEN_TYPE = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
  TableToken: "TableToken",
} as const;

export const ROLE = {
  Owner: "Owner",
  Employee: "Employee",
  Guest: "Guest",
} as const;

export const RoleValues = [ROLE.Owner, ROLE.Employee, ROLE.Guest] as const;

export const DISH_STATUS = {
  Available: "Available",
  Unavailable: "Unavailable",
  Hidden: "Hidden",
} as const;

export const DISH_STATUS_VALUES = [DISH_STATUS.Available, DISH_STATUS.Unavailable, DISH_STATUS.Hidden] as const;

export const TABLE_STATUS = {
  Available: "Available",
  Hidden: "Hidden",
  Reserved: "Reserved",
} as const;

export const TABLE_STATUS_VALUES = [TABLE_STATUS.Available, TABLE_STATUS.Hidden, TABLE_STATUS.Reserved] as const;

export const ORDER_STATUS = {
  Pending: "Pending",
  Processing: "Processing",
  Rejected: "Rejected",
  Delivered: "Delivered",
  Paid: "Paid",
} as const;

export const ORDER_STATUS_VALUES = [
  ORDER_STATUS.Pending,
  ORDER_STATUS.Processing,
  ORDER_STATUS.Rejected,
  ORDER_STATUS.Delivered,
  ORDER_STATUS.Paid,
] as const;

export const MANAGER_ROOM = "manager" as const;

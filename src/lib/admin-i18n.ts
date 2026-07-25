// Arabic labels for the admin dashboard (Phase 3). Status values are stored in
// the DB in English/enum form; these map them to Arabic for display only.

export const orderStatusLabels: Record<string, string> = {
  all: "كل الحالات",
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  in_delivery: "قيد التوصيل",
  delivered: "تم التسليم",
  cancelled: "ملغى",
};

export const appointmentStatusLabels: Record<string, string> = {
  all: "كل الحالات",
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  completed: "مكتمل",
  visited: "تمت الزيارة",
  cancelled: "ملغى",
};

export const deliveryTypeLabels: Record<string, string> = {
  home: "توصيل للمنزل",
  office: "توصيل للمكتب",
};

export const productActiveFilterLabels: Record<string, string> = {
  all: "الكل",
  active: "مُفعّل",
  inactive: "غير مُفعّل",
};

export const orderStatusLabel = (s: string) => orderStatusLabels[s] ?? s;
export const appointmentStatusLabel = (s: string) => appointmentStatusLabels[s] ?? s;
export const deliveryTypeLabel = (s: string) => deliveryTypeLabels[s] ?? s;
export const productActiveFilterLabel = (s: string) => productActiveFilterLabels[s] ?? s;

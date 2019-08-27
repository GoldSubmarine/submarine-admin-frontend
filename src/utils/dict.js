
//全部
export const all = [
  { label: "全部", value: "" },
];

//无
export const none = [
  { label: "无", value: "" },
];

//性别
export const sex = [
  { label: "男", value: "male" },
  { label: "女", value: "female" }
];

//人员类型
export const userType = [
  { label: "访客", value: "visitor" },
  { label: "正式人员", value: "formal" }
];

//岗位状态
export const jobStatus = [
  { label: "正常", value: "true" },
  { label: "停用", value: "false" }
];

//部门状态
export const deptStatus = [
  { label: "正常", value: "true" },
  { label: "停用", value: "false" }
];

//用户状态
export const userStatus = [
  { label: "激活", value: "true" },
  { label: "锁定", value: "false" }
];

//证件类型
export const credentialType = [
  { label: "身份证", value: "idCard" },
  { label: "护照", value: "passport" },
  { label: "港澳台通行证", value: "HMTpasses" },
  { label: "其他", value: "other" },
];

//正式员工角色类型
export const roleType = [
  // { label: "超级管理员", value: "1" },
  { label: "仓库管理员", value: 2 },
  { label: "值班人员", value: 3 },
  { label: "大屏展示", value: 4 },
  // { label: "访客", value: 5 },
];

//记录类型
export const recordType = [
  { label: "附近", value: "NEARBY" },
  { label: "离开", value: "LEAVE" },
  { label: "进入库区", value: "PUNCH_IN" },
  { label: "离开库区", value: "PUNCH_OUT" },
];

//设备授权类型
export const devicePermissionType = [
  { label: "人员", value: "user" },
  { label: "部门", value: "department" },
];

//设备授权类型
export const deviceType = [
  { label: "人证设备", value: "faceRecognition" },
  { label: "人脸打卡设备", value: "facePunch" },
  { label: "门禁读卡设备", value: "cardDoor" },
  { label: "远距离读卡设备", value: "cardRemote" },
  { label: "出入探测设备", value: "accessDetect" },
  { label: "物资探测设备", value: "goodsDetect" },
];

//设备授权类型
export const DevicePropertyType = [
  { label: "门内", value: "innerDoor" },
  { label: "门外", value: "outDoor" },
]

//设备授权类型
export const faceDeviceType = [
  { label: "人证设备", value: "faceRecognition" },
  { label: "人脸打卡设备", value: "facePunch" },
];

//门禁类型
// export const cardDoorType = [
//   { label: "大门", value: "bigGate" },
//   { label: "小门", value: "smallGate" },
// ];

//用户是否是人证设备新录入的
export const NewUserType = [
  { label: "人证设备读取的新用户", value: "newUser" },
  { label: "系统编辑过的用户", value: "oldUser" },
]

// 政审类型
export const PoliticalReviewType = [
  { label: "通过", value: "pass" },
  { label: "不通过", value: "notPass" },
]

// 考勤状态
export const DutyStatus = [
  { label: "待打卡", value: "pre" },
  { label: "考勤中", value: "processing" },
  { label: "考勤异常", value: "abnormal" },
  { label: "考勤正常", value: "normal" },
  { label: "补卡正常", value: "repair" },
]

// 值班日志状态
export const DutyLogStatus = [
  { label: "开启", value: "on" },
  { label: "关闭", value: "off" },
]

// 巡检类型
export const InspectionType = [
  { label: "库房", value: "1" },
  { label: "保管设施设备", value: "2" },
  { label: "装备器材", value: "3" },
]
export { Router } from "./Router";
export { RouterResponseCode, RouterResponse } from "./RouterResponse";

// 通用路由
export { WelcomeRouter } from "./WelcomeRouter";
export { ListStudentRouter } from "./ListStudentRouter";
export { ListTeacherRouter } from "./ListTeacherRouter";
export { ListCollegeRouter } from "./ListCollegeRouter";
export { ListClassAndGradeRouter } from "./ListClassAndGradeRouter";
export { ListCollectionGroupRouter } from "./ListCollectionGroupRouter";
export { ListCollectionItemRouter } from "./ListCollectionItemRouter";
export { ListProductRouter } from "./ListProductRouter";
export { ListProductCommentRouter } from "./ListProductCommentRouter";

// 注册子系统
export { CheckEmailRouter } from "./CheckEmailRouter";
export { RegisterRouter } from "./RegisterRouter";
export { GetVerificationCodeRouter } from "./GetVerificationCodeRouter";

// 登录子系统
export { LoginRouter } from "./LoginRouter";
export { LoginStatusRouter } from "./LoginStatusRouter";
export { LogoutRouter } from "./LogoutRouter";

// 个人信息子系统
export { ModifyPasswordRouter } from "./ModifyPasswordRouter";
export { StudentProfileRouter } from "./StudentProfileRouter";
export { StudentProfileUpdateRouter } from "./StudentProfileUpdateRouter";

// 作业收集子系统
export { AddGroupRouter } from "./AddGroupRouter";
export { AddItemRouter } from "./AddItemRouter";
export { AssignStudentToGroupRouter } from "./AssignUserToGroupRouter";
export { AddProductRouter } from "./AddProductRouter";
export { AddCommentRouter } from "./AddCommentRouter";
export { RateProductRouter } from "./RateProductRouter";

// 平台管理子系统
export { AddAdminRouter } from "./AddAdminRouter";
export { AddTeacherRouter } from "./AddTeacherRouter";
export { AddCollegeRouter } from "./AddCollegeRouter";
export { AddClassAndGradeRouter } from "./AddClassAndGradeRouter";

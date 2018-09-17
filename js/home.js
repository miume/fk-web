var home = {
    urls: {
        role : {
            getAllByPage : function() {
                return servers.backup() + "role/getAllByPage" ;
            },
            getAll : function() {
                return servers.backup() + "role/getAll" ;
            },
            getById : function() {
                return servers.backup() + "role/getById" ;
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "role/getByNameLikeByPage" ;
            },
            add : function() {
                return servers.backup() + "role/add" ;
            },
            assignPermissions : function() {
                return servers.backup() + "role/assignPermissions" ;
            },
            deleteById : function() {
                return servers.backup() + "role/deleteById" ;
            },
            deleteByIds : function() {
                return servers.backup() + "role/deleteByIds" ;
            },
            update : function() {
                return servers.backup() + "role/update" ;
            },
            getPermissionsById : function() {
                return servers.backup() + "role/getPermissionsById" ;
            },
            getAssignUsersById : function() {
                return servers.backup() + "role/getAssignUsersById" ;
            },
            assignRoleToUsers : function() {
                return servers.backup() + "role/assignRoleToUsers" ;
            },
        },
        loginLog:{
            getAllByPage : function(){
                return servers.backup() + "loginLog/getAllByPage";
            },
            getByDate : function(){
                return servers.backup() + "loginLog/getByDate";
            },
            deleteByIds:function(){
                return servers.backup() + "loginLog/deleteByIds"; 
            },
            getByDateToExcel : function(){
                return servers.backup() + "loginLog/getByDateToExcel";
            },
        }
        ,operationLog : {
            getAllByPage : function() {
                return servers.backup() + "actionLog/getAllByPage" ;
            },
            getByDate : function() {
                return servers.backup() + "actionLog/getByDate" ;
            },
            deleteByIds : function() {
                return servers.backup() + "actionLog/deleteByIds" ;
            },
            getByDateToExcel : function() {
                return servers.backup() + "actionLog/getByDateToExcel"
            },
        }
        ,department : {
            deleteByIds : function() {
                return servers.backup() + "department/deleteByIds" ;
            },
            deleteById : function() {
                return servers.backup() + "department/deleteById" ;
            },
            add : function() {
                return servers.backup() + "department/add" ;
            },
            getAll : function() {
                return servers.backup() + "department/getAll" ;
            },
            getAllByPage : function() {
                return servers.backup() + "department/getAllByPage" ;
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "department/getByNameLikeByPage" ;
            },
            getById : function() {
                return servers.backup() + "department/getById" ;
            },
            update : function() {
                return servers.backup() + "department/update" ;
            },
            getTop: function() {
                return servers.backup() + "department/getTop" ;
            },
            getSonByParent: function() {
                return servers.backup() + "department/getSonByParent" ;
            },
        }
        ,user : {
            add : function() {
                return servers.backup() + "user/add" ;
            },
            assignRolesToUsers : function() {
                return servers.backup() + "user/assignRolesToUsers";
            },
            deleteById : function() {
                return servers.backup() + "user/deleteById" ;
            },
            deleteByIds : function() {
                return servers.backup() + "user/deleteByIds" ;
            },
            getAll : function() {
                return servers.backup() + "user/getAll" ;
            },
            getAllByPage : function() {
                return servers.backup() + "user/getAllByPage" ;
            },
            getByDepartment : function() {
                return servers.backup() + "user/getByDepartment" ;
            },
            getById : function() {
                return servers.backup() + "user/getById" ;
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "user/getByNameLikeByPage" ;
            },
            getPermissionsById : function() {
                return servers.backup() + "user/getPermissionsById" ;
            },
            getRolesById : function() {
                return servers.backup() + "user/getRolesById" ;
            },
            login : function() {
                return servers.backup() + "user/login" ;
            },
            resetPassword : function() {
                return servers.backup() + "user/resetPassword" ;
            },
            update : function() {
                return servers.backup() + "user/update" ;
            },
            updatePassword : function() {
                return servers.backup() + "user/updatePassword" ;
            },
            updateDepartmentById : function() {
                return servers.backup() + "user/updateDepartmentById" ;
            },
            updateEnableById : function() {
                return servers.backup() + "user/updateEnableById" ;
            },
            getByTeam : function(){
                return servers.backup() + "user/getByTeam"
            }
        }
        ,navigations : {
            getAll : function() {
                return servers.backup() + "navigation/getAll" ;
            },
            updateNameById : function() {
                return servers.backup() + "navigation/updateNameById" ;
            },
            add : function() {
                return servers.backup() + "navigation/add" ;
            },
            getById : function() {
                return servers.backup() + "navigation/getById" ;
            },
            shift : function() {
                return servers.backup() + "navigation/shift" ;
            },
            getFirstLevelMenusById : function() {
                return servers.backup() + "navigation/getFirstLevelMenusById" ;
            },
        }
        ,menu1 : {
            getAll : function() {
                return servers.backup() + "firstLevelMenu/getAll" ;
            },
            updateNameById : function() {
                return servers.backup() + "firstLevelMenu/updateNameById" ;
            },
            add : function() {
                return servers.backup() + "firstLevelMenu/add" ;
            },
            getById : function() {
                return servers.backup() + "firstLevelMenu/getById" ;
            },
            deleteById : function() {
                return servers.backup() + "firstLevelMenu/deleteById" ;
            },
            shift : function() {
                return servers.backup() + "firstLevelMenu/shift" ;
            },
            getSecondLevelMenusById : function() {
                return servers.backup() + "firstLevelMenu/getSecondLevelMenusById" ;
            },
        }
        ,menu2 : {
            getAll : function() {
                return servers.backup() + "secondLevelMenu/getAll" ;
            },
            getOperationsById : function() {
                return servers.backup() + "secondLevelMenu/getOperationsById" ;
            },
            updateNameById : function() {
                return servers.backup() + "secondLevelMenu/updateNameById" ;
            },
            add : function() {
                return servers.backup() + "secondLevelMenu/add" ;
            },
            getById : function() {
                return servers.backup() + "secondLevelMenu/getById" ;
            },
            deleteById : function() {
                return servers.backup() + "secondLevelMenu/deleteById" ;
            },
            shift : function() {
                return servers.backup() + "secondLevelMenu/shift" ;
            },
            assignOperations : function() {
                return servers.backup() + "secondLevelMenu/assignOperations" ;
            },
        }
        ,operation : {
            getAll : function() {
                return servers.backup() + "operation/getAll" ;
            },
        }
        ,operationManagement : {
            getAllByPage : function() {
                return servers.backup() + "operation/getAllByPage";
            },
            getById : function() {
                return servers.backup() + "operation/getById";
            },
            update : function() {
                return servers.backup() + "operation/update";
            }
        }
        ,dataDictionary : {
            addData : function(){
                return servers.backup() + "dataDictionary/addData";
            },
            addType : function(){
                return servers.backup() + "dataDictionary/addType";
            },
            deleteDataById : function(){
                return servers.backup() + "dataDictionary/deleteDataById";
            },
            deleteDataByIds : function(){
                return servers.backup() + "dataDictionary/deleteDataByIds";
            },
            deleteTypeById : function(){
                return servers.backup() + "dataDictionary/deleteTypeById";
            },
            deleteTypesByIds : function(){
                return servers.backup() + "dataDictionary/deleteTypesByIds";
            },
            getAllDataByPageNameLike : function(){
                return servers.backup() + "dataDictionary/getAllDataByPageNameLike";
            },
            getAllDataByTypeByPage : function(){
                return servers.backup() + "dataDictionary/getAllDataByTypeByPage";
            },
            getAllDataByTypeId : function(){
                return servers.backup() + "dataDictionary/getAllDataByTypeId";
            },
            getAllTypes : function(){
                return servers.backup() + "dataDictionary/getAllTypes";
            },
            getAllTypesByNameLikeByPage : function(){
                return servers.backup() + "dataDictionary/getAllTypesByNameLikeByPage";
            },
            getAllTypesByPage : function(){
                return servers.backup() + "dataDictionary/getAllTypesByPage";
            },
            getDataById : function(){
                return servers.backup() + "dataDictionary/getDataById";
            },
            getTypeById : function(){
                return servers.backup() + "dataDictionary/getTypeById";
            },
            updateData : function(){
                return servers.backup() + "dataDictionary/updateData";
            },
            updateType : function(){
                return servers.backup() + "dataDictionary/updateType";
            },
        }
        ,materialTypeInfo : {
            getAllByPage : function() {
                return servers.backup() + "materialType/getAllByPage";
            },
            add : function() {
                return servers.backup() + "materialType/add" ;
            },
            deleteById : function() {
                return servers.backup() + "materialType/deleteById";
            },
            deleteByIds : function() {
                return servers.backup() + "materialType/deleteByIds";
            },
            getAll : function() {
                return servers.backup() + "materialType/getAll";
            },
            getById : function() {
                return servers.backup() + "materialType/getById";
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "materialType/getByNameLikeByPage";
            },
            update : function() {
                return servers.backup() + "/materialType/update";
            },
        }
        ,materialConsumptionItem : {
            add : function() {
                return servers.backup() + "materialConsumptionItem/add";
            },
            deleteById : function() {
                return servers.backup() + "materialConsumptionItem/deleteById" ;
            },
            deleteByIds : function() {
                return servers.backup() + "materialConsumptionItem/deleteByIds";
            },
            getAll : function() {
                return servers.backup() + "materialConsumptionItem/getAll";
            },
            getAllByPage : function() {
                return servers.backup() + "materialConsumptionItem/getAllByPage";
            },
            getById : function() {
                return servers.backup() + "materialConsumptionItem/getById";
            },
            getByMaterialTypeAndNameLikeByPage : function() {
                return servers.backup() + "materialConsumptionItem/getByMaterialTypeAndNameLikeByPage";
            },
            update : function() {
                return servers.backup() + "materialConsumptionItem/update";
            },
        }
        ,maintenanceSchedule : {
            add : function() {
                return servers.backup() + "maintenanceSchedule/add";
            },
            getAllByPage : function() {
                return servers.backup() + "maintenanceSchedule/getAllByPage";
            },
            getById : function() {
                return servers.backup() + "maintenanceSchedule/getById";
            },
            getByNameLikeByPage : function() {
                return servers.backup() + "maintenanceSchedule/getAllByNameAndDescriptionLikeByPage";
            },
            update : function() {
                return servers.backup() + "maintenanceSchedule/update";
            },
            deleteByIds : function() {
                return servers.backup() + "maintenanceSchedule/deleteByIds";
            },
            download : function() {
                return servers.backup() + "maintenanceSchedule/download";
            },
            saveToRecord : function() {
                return servers.backup() + "";
            },
            getNotCompleteByPage : function() {
                return servers.backup() + "maintenanceSchedule/getAllNotCompleteByPage";
            }
        }
        ,checkRecord : {
            add : function() {
                return servers.backup() + "backFillInfo/add";
            },
            getAllByPage : function() {
                return servers.backup() + "backFillInfo/getAllByPage";
            },
            download : function() {
                return servers.backup() + "backFillInfo/getByDateToExcel";
            },
            getById : function() {
                return servers.backup() + "backFillInfo/getById";
            },
            update : function() {
                return servers.backup() + "backFillInfo/update";
            },
            deleteByIds : function() {
                return servers.backup() + "backFillInfo/deleteByIds";
            },
            getByEquipmentAndDate : function() {
                return servers.backup() + "backFillInfo/getAllByEquipmentAndTime";
            },

        }
        ,equipment : {
            add : function() {
                return servers.backup() + "equipmentInfo/add";
            },
            getAllByPage : function() {
                return servers.backup() + "equipmentInfo/getAllByPage";
            },
            deleteByIds : function() {
                return servers.backup() + "equipmentInfo/deleteByIds";
            },
            update : function() {
                return servers.backup() + "equipmentInfo/update";
            },
        }

        ,temporal : {
            download : function() {
                return servers.backup() + "temporalInterval/download";
            },
            edit : function() {
                return servers.backup() + "temporalInterval/edit";
            },
            getAllByYear : function() {
                return servers.backup() + "temporalInterval/getAllByYear";
            },
            getById : function(){
                return servers.backup() + "temporalInterval/getById";
            }
        }
        ,materialConsumptionManagement : {
            add : function() {
                return servers.backup() + "materialConsumptionHeader/add";
            },
            exportByStartDateAndEndDate : function() {
                return servers.backup() + "materialConsumptionHeader/exportByStartDateAndEndDate";
            },
            getByStartDateAndEndDateByPage : function() {
                return servers.backup() + "materialConsumptionHeader/getByStartDateAndEndDateByPage";
            },
            update : function() {
                return servers.backup() + "materialConsumptionHeader/update";
            },
            getById : function(){
                return servers.backup() + "materialConsumptionHeader/getById";
            },
        }
        ,dispatchAccount :{
            generateStandingBook : function(){
                return servers.backup() + "standingBookHeader/generateStandingBook";
            },
            add : function(){
                return servers.backup() + "standingBookHeader/add";
            },
            getByDateAndScheduleByPage : function(){
                return servers.backup() + "standingBookHeader/getByDateAndScheduleByPage";
            },
            getDetailByStandingBookId : function(){
                return servers.backup() + "standingBookHeader/getDetailByStandingBookId";
            },
            update : function(){
                return servers.backup() + "standingBookHeader/update";
            },
            getAll : function(){
                return servers.backup() + "SectionInfo/getAll";
            },
            getAllSchedule : function(){
                return servers.backup() + "clazz/getAll";
            }
        }
        ,materialStatistics : {
            exportByDate: function () {
                return servers.backup() + "materialConsumptionReportHeader/exportByDate";
            },
            generateReport: function () {
                return servers.backup() + "materialConsumptionReportHeader/generateReport";
            },
            getById: function () {
                return servers.backup() + "materialConsumptionReportHeader/getById";
            },
            getByStartDateAndEndDateByPage: function () {
                return servers.backup() + "materialConsumptionReportHeader/getByStartDateAndEndDateByPage";
            },
            reGenerateReport: function () {
                return servers.backup() + "materialConsumptionReportHeader/reGenerateReport";
            },
        }
        ,clazz : {
            add : function(){
                return servers.backup() + "clazz/add";
            },
            deleteById : function(){
                return servers.backup() + "clazz/deleteById";
            },
            deleteByIds : function(){
                return servers.backup() + "clazz/deleteByIds";
            },
            getAll : function(){
                return servers.backup() + "clazz/getAll";
            },
            getAllByPage : function(){
                return servers.backup() + "clazz/getAllByPage";
            },
            getById : function(){
                return servers.backup() + "clazz/getById";
            },
            getByNameLikeByPage : function(){
                return servers.backup() + "clazz/getByNameLikeByPage";
            },
            update : function(){
                return servers.backup() + "clazz/update";
            },
        }
        ,MaterialItem : {
            add : function(){
                return servers.backup() + "loadingMaterialItem/add";
            },
            deleteById : function(){
                return servers.backup() + "loadingMaterialItem/deleteById";
            },
            deleteByIds : function(){
                return servers.backup() + "loadingMaterialItem/deleteByIds";
            },
            getAll : function(){
                return servers.backup() + "loadingMaterialItem/getAll";
            },
            getAllByPage : function(){
                return servers.backup() + "loadingMaterialItem/getAllByPage";
            },
            getById : function(){
                return servers.backup() + "loadingMaterialItem/getById";
            },
            getByNameLikeByPage : function(){
                return servers.backup() + "loadingMaterialItem/getByNameLikeByPage";
            },
            update : function(){
                return servers.backup() + "loadingMaterialItem/update";
            },
        }
        ,truckLoading :{
            add : function(){
                return servers.backup() + "truckLoadingHeader/add"
            },
            deleteById : function(){
                return servers.backup() + "truckLoadingHeader/deleteById"
            },
            deleteByIds : function(){
                return servers.backup() + "truckLoadingHeader/deleteByIds"
            },
            exportById : function(){
                return servers.backup() + "truckLoadingHeader/exportById"
            },
            getById : function(){
                return servers.backup() + "truckLoadingHeader/getById"
            },
            getByStartDateAndEndDateAndClazzByPage : function(){
                return servers.backup() + "truckLoadingHeader/getByStartDateAndEndDateAndClazzByPage"
            },
            isExists : function(){
                return servers.backup() + "truckLoadingHeader/isExists"
            },
            update : function(){
                return servers.backup() + "truckLoadingHeader/update"
            },
        }
        ,ropeWayRunningRecord : {
            add : function() {
                return servers.backup() + "ropeWayInfo/add";
            },
            addCause : function() {
                return servers.backup() + "ropeWayInfo/addCause";
            },
            addRemark : function() {
                return servers.backup() + "ropeWayInfo/addRemarks";
            },
            getAllByPage : function() {
                return servers.backup() + "ropeWayInfo/getAllByPage";
            },
            getByDate : function() {
                return servers.backup() + "ropeWayInfo/getByDate";
            },
            getById : function() {
                return servers.backup() + "ropeWayInfo/getById";
            },
            download : function() {
                return servers.backup() + "ropeWayInfo/getByDateToExcel";
            },
            deleteByIds : function() {
                return servers.backup() + "ropeWayInfo/deleteByIds";
            }
        }
        ,planDataManagement : {
            add : function(){
                return servers.backup() + "materialConsumptionPlanHeader/add";
            },
            getById : function(){
                return servers.backup() + "materialConsumptionPlanHeader/getById";
            },
            getByStartDateAndEndDateByPage : function(){
                return servers.backup() + "materialConsumptionPlanHeader/getByStartDateAndEndDateByPage";
            },
            update : function(){
                return servers.backup() + "materialConsumptionPlanHeader/update";
            }
        }
        ,waterConsumption : {
            findByDateBetweenByPage: function () {
                return servers.backup() + "waterConsumptionReportHeadController/findByDateBetweenByPage";
            },
            findById: function () {
                return servers.backup() + "waterConsumptionReportHeadController/findById";
            },
            generateWaterMonth: function () {
                return servers.backup() + "waterConsumptionReportHeadController/generateWaterMonth";
            },
            reGenerateWaterMonth: function () {
                return servers.backup() + "waterConsumptionReportHeadController/reGenerateWaterMonth";
            },
            getByDateBetweenByPage: function () {
                return servers.backup() + "waterConsumptionInfo/getByDateBetweenByPage";
            },
            getById: function () {
                return servers.backup() + "waterConsumptionInfo/getById";
            },
            update: function () {
                return servers.backup() + "waterConsumptionInfo/update";
            },
            add: function () {
                return servers.backup() + "waterConsumptionInfo/add";
            },
            getAllTypes: function () {
                return servers.backup() + "waterTypeInfo/getAllTypes";
            },
        }
        ,cavingReport : {
            getByDateByPage: function () {
                return servers.backup() + "cavingDayReportHeader/getByDateByPage";
            },
            getById: function () {
                return servers.backup() + "cavingDayReportHeader/getById";
            },
            update: function () {
                return servers.backup() + "cavingDayReportHeader/update";
            },
            add: function () {
                return servers.backup() + "cavingDayReportHeader/add";
            },
            getByStartDateAndEndDateByPage: function () {
                return servers.backup() + "cavingMonthReportHeader/getByStartDateAndEndDateByPage";
            },
            getCavingMonthReportById: function () {
                return servers.backup() + "cavingMonthReportHeader/getById";
            },
            reGenerateReport: function () {
                return servers.backup() + "cavingMonthReportHeader/reGenerateReport";
            },
            exportById: function () {
                return servers.backup() + "cavingMonthReportHeader/exportById";
            },
            generateReport: function () {
                return servers.backup() + "cavingMonthReportHeader/generateReport";
            },
        }
        ,dayreport : {
            add : function() {
                return servers.backup() + "ropeWayCrushingDayReport/add";
            },
            getAllByPage : function() {
                return servers.backup() + "ropeWayCrushingDayReport/getAllByPage";
            },
            getByDate : function() {
                return servers.backup() + "ropeWayCrushingDayReport/getByDate";
            },
            getById : function() {
                return servers.backup() + "ropeWayCrushingDayReport/getById";
            },
            download : function() {
                return servers.backup() + "ropeWayCrushingDayReport/getByDateToExcel";
            },
            update : function() {
                return servers.backup() + "ropeWayCrushingDayReport/update";
            },
            deleteByIds : function() {
                return servers.backup() + "ropeWayCrushingDayReport/deleteByIds";
            }
        }
        ,monthreport : {
            getAll : function() {
                return servers.backup() + "ropeWayCrushingMonthReport/getByYear";
            },
            getByDate :function() {
                return servers.backup() + "ropeWayCrushingMonthReport/getByDate";
            },
            getDetailById : function() {
                return servers.backup() + "ropeWayCrushingMonthReport/getById";
            },
            generateByYearMonth : function() {
                return servers.backup() + "ropeWayCrushingMonthReport/generateByYearMonth";
            },
            download : function() {
                return servers.backup() + "ropeWayCrushingMonthReport/getByYearMonthToExcel";
            },
            regenerateAble : function() {
                return servers.backup() + "ropeWayCrushingMonthReport/regenerateAble";
            }
        }
        ,parameter : {
            getByGroup : function() {
                return servers.backup() + "parameter/getByGroup";
            },
        }
        ,group : {
            getAll : function () {
                return servers.backup() + "group/getAll";
            },
        }
        ,parameter : {
            getById : function() {
                return servers.backup() + "parameter/getById";
            },
            getByGroup : function() {
                return servers.backup() + "parameter/getByGroup";
            }
        }
        ,parameterData : {
            getByTableNameAndDate : function () {
                return servers.backup() + "parameterData/getByTableNameAndDate";
            },
        }
        ,indexManage : {
            add : function() {
                return servers.backup() + "paramConfigInfo/add";
            },
            getAll : function() {
                return servers.backup() + "paramConfigInfo/getAllByPage"
            },
            getByGroupAndParamByPage : function() {
                return servers.backup() + "paramConfigInfo/getByGroupAndParamByPage";
            },
            getById : function() {
                return servers.backup() + "paramConfigInfo/getById";
            },
            deleteByIds : function() {
                return servers.backup() + "paramConfigInfo/deleteByIds";
            },
            download : function() {
                return servers.backup() + "paramConfigInfo/exportToExcelByGroupAndParam";
            },
            updateIndexById : function() {
                return servers.backup() + "paramConfigInfo/update";
            },
            getAllGroups : function() {
                return servers.backup() + "group/getAll";
            },
            getAllParams : function() {
                return servers.backup() + "parameter/getAll";
            } 

           

        }
        ,production : {
            findByUserId : function(){
                return servers.backup() + "materialListFlagInfo/findByUserId"
            },
            update : function(){
                return servers.backup() + "materialListFlagInfo/update"
            }
        }
        ,ddConsumeTeamReport : {
            add : function(){
                return servers.backup() + "ddSmaterialConsumeTeamReport/add"
            },
            getByDateByPage : function(){
                return servers.backup() + "ddSmaterialConsumeTeamReport/getByDateByPage"
            },
            getByPage : function(){
                return servers.backup() + "ddSmaterialConsumeTeamReport/getByPage"
            },
        }
        ,ddConsumeDayReport : {
            getByDate : function(){
                return servers.backup() + "ddSmaterialConsumeDayReport/getByDate"
            }
        }
        ,ddConsumeYearReport : {
            getByDate : function(){
                return servers.backup() + "ddSmaterialConsumeYearReport/getByDate"
            }
        }
        ,coefficient : {
            add : function(){
                return servers.backup() + "coEfficient/add"
            },
            getAllByPage : function(){
                return servers.backup() + "coEfficient/getAllByPage"
            },
            getByDateByPage : function(){
                return servers.backup() + "coEfficient/getByDateByPage"
            },
            update : function(){
                return servers.backup() + "coEfficient/update"
            },
            getById : function(){
                return servers.backup() + "coEfficient/getById"
            },
        }
        ,sample : {
            add : function(){
                return servers.backup() + "sampleManageInfo/add"
            },
            delete : function(){
                return servers.backup() + "sampleManageInfo/delete"
            },
            deleteByBatch : function(){
                return servers.backup() + "sampleManageInfo/deleteByBatch"
            },
            exportByGet : function(){
                return servers.backup() + "sampleManageInfo/exportByGet"
            },
            getAllByPage : function(){
                return servers.backup() + "sampleManageInfo/getAllByPage"
            },
            getAllBySendIdAndNameLike : function(){
                return servers.backup() + "sampleManageInfo/getAllBySendIdAndNameLike"
            },
            getOneById : function(){
                return servers.backup() + "sampleManageInfo/getOneById"
            },
            update : function(){
                return servers.backup() + "sampleManageInfo/update"
            },
        }
        ,check : {
            getAll : function(){
                return servers.backup() + "sendToCheck/getAll"
            },
            getById : function(){
                return servers.backup() + "sendToCheck/getById"
            },
        }
        ,delegation : {
            add : function(){
                return servers.backup() + "delegationOrderHeader/add"
            },
            getAll : function(){
                return servers.backup() + "delegationOrderHeader/getAll"
            },
            getById : function(){
                return servers.backup() + "delegationOrderHeader/getById"
            },
        }
        ,delegationInfo : {
            findAll : function(){
                return servers.backup() + "delegationInfo/findAll"
            }
        }
        ,testMethodInfo : {
            findAll : function(){
                return servers.backup() + "testMethodInfo/findAll"
            }
        }
        ,team : {
            add : function(){
                return servers.backup() + "team/add"
            },
            deleteById : function(){
                return servers.backup() + "team/deleteById"
            },
            deleteByIds : function(){
                return servers.backup() + "team/deleteByIds"
            },
            getAll : function(){
                return servers.backup() + "team/getAll"
            },
            getAllByPage : function(){
                return servers.backup() + "team/getAllByPage"
            },
            getById : function(){
                return servers.backup() + "team/getById"
            },
            getByNameLikeByPage : function(){
                return servers.backup() + "team/getByNameLikeByPage"
            },
            update : function(){
                return servers.backup() + "team/update"
            },
        }
    }
   
    /** start */
    , navigationsClicks: null  //所有的一级菜单点击栏
    , menu1Clicks: null  //所有的一级菜单点击栏
    , menu2Clicks: null  //所有的二级菜单点击栏
    , navigations: []
    , menu1s: []
    , menu2s: []
    , navigationsWrapper: null
    , menu1Wrapper: null
    , monitor_data: null
    , realdata_interval: []
    , singlePage_interval: []
    , user: null
    , operations: []
    /** end */
    /**
     *  初始化函数
     * @param userJson  session中存储的用户信息
     * @param menuWrapper 用来包装导航菜单的块
     * @param menu1Wrapper 用来包装一级菜单的块
     * @hides 代表所有三级菜单点击后显示的内容的id
     */
    , init: function (userJson, navigationsWrapper, menu1Wrapper) {
        home.navigationsWrapper = navigationsWrapper;
        home.menu1Wrapper = menu1Wrapper;

        /**获取session用户信息 */
        console.log(userJson)
        const user = userJson;
        home.user = userJson;
        home.navigations = userJson.navigations;
        home.menu1s = [];
        home.menu2s = [];
        //console.log(home.navigations)
        /**遍历用户导航信息，从而获取导航菜单，一级菜单和二级菜单 填充home.navigations,home.menu1,home.menu2 */
        /**得先对获取得导航菜单、一级菜单、二级菜单进行排序 */
        var navigationsCodes = []  //用户导航菜单去重
        var menu1Codes = []        //用户一级菜单去重
        home.navigations.sort(function(a, b){
            return a.rank - b.rank;
        })
        userJson.navigations.forEach(function(element){
            home.navigationsWrapper.append("<li id='navigations-li-" + (element.id) + "' class='menu-tab-bar whiteFontMenu'><a href='#'>" + element.name + "</a></li>", null);
        })
        /**选中的导航菜单id 默认为1 */
        var selectedNavigations = localStorage.getItem('selectedNavigations') || $(home.navigationsWrapper.children('li')[0]).attr('id').substr(15);
        var selectedMenu1 = localStorage.getItem('selectedMenu1') || null;
        var selectedMenu2 = localStorage.getItem('selectedMenu2') || null;
        //console.log('selectedNavigations=' + selectedNavigations)
        //console.log('selectedMenu1=' + selectedMenu1)
        //console.log('selectedMenu2=' + selectedMenu2)
        /**给选的导航菜单追加默认selected类标签，也是默认样式 */
        $('#navigations-li-'+ selectedNavigations).addClass('chosenMenu');
        home.navigationsClicks = home.navigationsWrapper.children('.menu-tab-bar');
        //console.log(home.navigationsClicks)
        /**给选中的导航菜单绑定点击事件 */
        home.funcs.bindClickAndMouseEventsForNavigations();
        /**给selected状态的导航菜单设置默认状态，包括填充一级菜单、给其所有的一级菜单追加二级菜单和绑定事件 */
        var selectedNavigationCode = $('.chosenMenu').attr('id').substr(15);
        home.menu1s = home.funcs.getMenu1ListByNavigation(selectedNavigationCode);
        /**将一级菜单填充到框内，并且给一级菜单都绑定弹出二级菜单的事件 */
        home.funcs.appendMenu1sToWrapperAndCarryModels(home.menu1s);
        /**绑定退出登录事件 */
        var $exit = $("#exit");
        home.funcs.handleLogout($exit);
    }
    ,funcs : {
        /**给导航菜单绑定点击事件 */
        bindClickAndMouseEventsForNavigations : function () {
            home.navigationsClicks.on('mouseenter', function(){
                $(this).addClass('blue_font');
            }).on('mouseleave', function() {
                $(this).removeClass('blue_font');
            }).on('click', function () {
                /**首先清除interval */
                home.funcs.clearIntervals(home.realdata_interval);
                /**点击一级菜单必须把所有展示框移除 */
                $('.display-component-container').remove();

                /**记住当前一级菜单 */
                localStorage.setItem('selectedNavigations', $(this).attr('id').substr(15));
                localStorage.setItem('selectedMenu1', null);
                localStorage.setItem('selectedMenu2', null);
                //console.log(localStorage.getItem('selectedNavigations'));
                /**首先将上一次selected的标签移除样式，然后给当前点击元素追加样式 */
                $('.navigations .chosenMenu').removeClass('chosenMenu');
                $('#navigations-li-'+ localStorage.getItem('selectedNavigations')).addClass('chosenMenu');

                /**通过导航菜单的code获取二级菜单 */
                const navigationsCode = localStorage.getItem('selectedNavigations');
                
                home.menu1s = home.funcs.getMenu1ListByNavigation(navigationsCode);
                /**将一级菜单填充到框内，并且给一级菜单都绑定弹出二级菜单的事件 */
                home.funcs.appendMenu1sToWrapperAndCarryModels(home.menu1s);
            })
        }
        /**通过导航菜单的code获取其下的所有一级菜单 */
        ,getMenu1ListByNavigation : function(selectedNavigationCode){
            //console.log(home.navigations)
            home.navigations.forEach(function(element){
                if(selectedNavigationCode == element.id){
                    home.menu1s = element.firstLevelMenus;
                }
            })
            //console.log(home.menu1s)
            home.menu1s.sort(function(a, b){
                return a.rank - b.rank;
            })
            return home.menu1s;
        }
        /**将一级菜单填充到一级菜单容器 */
        ,appendMenu1sToWrapperAndCarryModels : function(menu1List){
            /**首先清空menu1wrapper的内容 */
            home.menu1Wrapper.empty();
            /**开始填充一级菜单 */
            menu1List.forEach(function(element){
                home.menu1Wrapper.append(
                    "<div id='menu1-li-" + (element.id) + "' class='menu1-tab-bar'>" +
                    "<li class='menu1-tab-bar-item'>" +
                    //"<i class='fa fa-caret-right'></i> &nbsp" +
                    "<div class='fl'><img src='./" + (element.path) + "' alt='' width='20px' height='20px' style='position:relative;top: 8px;left: 13px;'></div>"+
                    "<a href='#'>" + element.name + "</a>" +
                    "</li>" +
                    "</div>" +
                    "<div id='menu1-li-hide-" + (element.id) + "'class='hide models'>" +
                    "<ul></ul>" +
                    "</div>", null) ;
            })
            /**当前导航菜单下的所有的一级菜单 */
            home.menu1Clicks = $('.menu1-tab-bar');
            //console.log(home.menu1Clicks);
            //用于一级菜单保存记录，如果有点击过一级菜单，此处就有值，否则则为null
            var selectedMenu1Code = localStorage.getItem('selectedMenu1');           
            //console.log(selectedMenu1Code)
            //console.log(localStorage.getItem('selectedMenu2'))
            /**如果记录了用户的一级菜单，就执行下面的逻辑 */
            if(selectedMenu1Code != null && localStorage.getItem('selectedMenu2') != 'null' ){
                //console.log("selectedMenu1Code="+selectedMenu1Code)
                //console.log(localStorage.getItem('selectedMenu2'))
                var selectedTabBarId = 'menu1-li-' + selectedMenu1Code;
                var selectedTabBarItem = $('#' + selectedTabBarId);  //一级菜单
                selectedTabBarItem.next().removeClass('hide')//二级菜单显示
                menu1List.forEach(function(ele){
                    if(selectedMenu1Code == ele.id){
                        home.menu2s = ele.secondLevelMenus;
                    }
                })
                home.menu2s.sort(function(a, b ){
                    return a.rank - b.rank;
                })
                //console.log(home.menu2s);
                //找到hide元素
                var menu2Wrapper = selectedTabBarItem.next().children('ul');
                menu2Wrapper.empty();
                home.menu2s.forEach(function(ele){
                    menu2Wrapper.append("<li id='menu2-li-"+ (ele.id) +"' class='menu2-tab-bar whiteFontMenu2'><a href='#'>"+ ele.name +"</a></li>")
                })
                var menu2Code = localStorage.getItem('selectedMenu2');
                $('#menu2-li-' + menu2Code).addClass('chosenMenu2');
                //console.log('#menu2-li-' + menu2Code)
                /**二级菜单加载完毕后，需要把后面对应的html加载进来 */
                var $right = $('.right');
                var page;
                //console.log(menu2Code)
                home.menu2s.forEach(function(ele){
                    if(menu2Code == ele.id){
                        page = ele.page;
                    }
                })
                var path = "html/" + page + ".html";
                $right.load(path);

                home.menu2Clicks = menu2Wrapper.children('li');
                /**追加二级菜单点击事件 */
                home.funcs.addMenu2ClickEvent();
            }

             /** 初始化的时候给记忆中的一级菜单添加chosenMenu2类 */
             var menu1Id = '#menu1-li-' + localStorage.getItem('selectedMenu1') ;
             $(menu1Id).addClass('chosenMenu1');
 
             /**给所以的一级菜单追加点击事件 */
             home.funcs.addMenu1ClickEvent();

        }
        /**给一级菜单添加点击事件 */
        ,addMenu1ClickEvent : function() {
            /**先删除所有绑定的事件 */
            home.menu1Clicks.off('click').on('click', function() {
                home.funcs.clearIntervals(home.realdata_interval);
                /**点击一级菜单必须把所有的展示框移除 */
                $('.display-component-container').remove();

                /**一级菜单样式切换逻辑 点击一个关闭其他*/
                localStorage.setItem('selectedMenu1',$(this).attr('id').substr(9));
                localStorage.setItem('selectedMenu2',null);
                
                var menu1Code = localStorage.getItem('selectedMenu1');
                //console.log(menu1Code);
                var menu1Id = 'menu1-li-' + localStorage.getItem('selectedMenu1');
                if($('.chosenMenu1').attr('id') != menu1Id) {
                    $('.chosenMenu1').next().addClass('hide')
                   // $('.chosenMenu1').find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right');
                }
                $('.chosenMenu1').removeClass('chosenMenu1');
                $('#' + menu1Id ).addClass('chosenMenu1');
                 
                const _this_next = $('#' + menu1Id).next();
                _this_next.attr('class').indexOf('hide') > -1 ?
                    (function () {
                        _this_next.removeClass('hide');
                       /** $('#' + menu1Id).find('li').children('i').removeClass('fa-caret-right').addClass('fa-caret-down');**/
                    })() :
                    (function () {
                        _this_next.addClass('hide')
                       /** $('#' + menu1Id).find('li').children('i').removeClass('fa-caret-down').addClass('fa-caret-right')*/
                    })()
                    
                    /**获取二级菜wrapper */
                    var menu2Wrapper = _this_next.children('ul');
                    /**获取一级菜单下隐藏的二级菜单的id */
                    var menu1HideCode = _this_next.attr('id').substr(14);
                    /**获取当前一级菜单下所有的二级菜单的集合 */
                    home.menu1s.forEach(function(ele) {
                        if(menu1Code == ele.id) {
                            home.menu2s = ele.secondLevelMenus;
                        }
                    })
                    home.menu2s.sort(function(a, b){
                        return a.rank - b.rank;
                    })
                    //console.log(home.menu2s);
                    /**填充三级菜单 */
                    menu2Wrapper.empty();
                    home.menu2s.forEach(function(ele){
                        //console.log(ele)
                        menu2Wrapper.append("<li id='menu2-li-" + (ele.id) +"' class='menu2-tab-bar whiteFontMenu2'><a href='#'>"+ (ele.name) +"</a></li>",null);
                    })
                    /**此处二级菜单已填充完毕 */
                    home.menu2Clicks = menu2Wrapper.children('li');

                    /**追加二级菜单点击事件 */
                    home.funcs.addMenu2ClickEvent();
            })
        }
        /**三级菜单点击事件 */
        ,addMenu2ClickEvent : function() {
            $('.layui-laypage').remove();
            home.menu2Clicks.on('click',function(){
                $('.chosenMenu2').removeClass('chosenMenu2');
                $(this).addClass('chosenMenu2');
                /**记录用户点击二级菜单的事件 */
                localStorage.setItem('selectedMenu2', $(this).attr('id').substr(9));
                /**获取展示框并且展示二级菜单对应的内容 */
                var $right = $('.right');
                var page;
                var menu2Code = localStorage.getItem('selectedMenu2');
                home.menu2s.forEach(function(ele){
                    if(menu2Code == ele.id){
                        page = ele.page;
                    }
                })
                var path = "html/" + page + ".html";
                $right.load(path);
            })
        }
        /**清除Intervals */
        ,clearIntervals : function (intervals) {
            intervals.forEach(function(e) {
                clearInterval(e);
            })
            //清空所有的intervals
            intervals.splice(0, home.realdata_interval.length)
        }
        /**退出登录事件 */
        ,handleLogout : function($exit) {
            $exit.on('click', function(){
                /**清除用户信息 */
                localStorage.clear();
                /**清除用户登录信息 */
                $.session.clear();
                /**返回登录页面 */
                window.location.href = './login.html';
                
            })
        }
        /**绑定全选事件 */
        /**
         * selectAllBox ：表示thead中的checkbox的id
         * subCheckBoxes ：表示每行的class
         * checkedBoxLen ：表示被选中的行数
         * $table ：表示表格的id
         */
        ,bindselectAll : function (selectAllBox, subCheckBoxes, checkedBoxLen, $table) {
            selectAllBox.off('change').on('change', function() {
                var status = selectAllBox.prop('checked');
                subCheckBoxes.each(function() {
                    $(this).prop('checked',status);
                })
            })
            subCheckBoxes.off('click').on('click', function() {
                var statusNow = $(this).prop('checked');
                if(statusNow == false) {
                    selectAllBox.prop('checked', false);
                } else if(statusNow === true && checkedBoxLen.length === $table.children('tbody').children('tr').length) {
                    selectAllBox.prop('checked', true);
                }
            })
        }
    }
}

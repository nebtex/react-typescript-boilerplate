import { observable, action, ObservableMap } from 'mobx';

interface IServiceRole {
  luaScript: string;
  impersonateWithinRole: boolean;
  proxy: boolean;
  isActive: boolean;
}

export default class EditServiceFormStore {
  @observable subDomain: string = ''
  @observable logo: string = ''
  @observable name: string = ''
  @observable shortDescription: string = ''
  @observable longDescription: string = ''
  @observable longDescriptionUrl: string = ''
  
  //those are the roles that will be send to the backend
  //before the api call the save function it should check the serviceRoles
  //and remove all the roles in the roles map, not defined in serviceRoles
  @observable roles: ObservableMap<IServiceRole> = observable.map<IServiceRole>({})
  
  //service roles this is useful for maintain a track of the roles that will be
  //send to the backend
  @observable serviceRoles: string[]

  //all the roles this come from read all the current available services
  @observable allRoles:string[] = []

  //About roles, serviceRoles and allRoles, interaction
  // if  a new serviceRoles is created a role should be created too (Done)
  // if  a  serviceRoles is deleted the role in roles map should not change (this is only done just before to send the api request) (Done)
  // if a existing serviceRoles is move to AllRoles, the role in the roles map should not change (Done)
  // if a role is moved from AllRoles to a  serviceRoles, and the role not exist in the service map, it should create a new one (Done) -> this is because the addServiceRole already does that


  @action updateLuaScript = (value: string, role: string) => {
    if (!this.roles.has(role)) return;
    let txRole = this.roles.get(role)
    txRole.luaScript = value
    this.roles.set(role, txRole);
  }

  @action updateImpersonateWithinRole = (value: boolean, role: string) => {
    if (!this.roles.has(role)) return;
    let txRole = this.roles.get(role)
    txRole.impersonateWithinRole = value
    this.roles.set(role, txRole);
  }

  @action updateProxy = (value: boolean, role: string) => {
    if (!this.roles.has(role)) return;
    let txRole = this.roles.get(role)
    txRole.proxy = value
    this.roles.set(role, txRole);
  }

  @action updateIsActive = (value: boolean, role: string) => {
    if (!this.roles.has(role)) return;
    let txRole = this.roles.get(role)
    txRole.isActive = value
    this.roles.set(role, txRole);
  }

  @action updateSubDomain = (value: string) => {
    this.subDomain = value;
  }

  @action updateName = (value: string) => {
    this.name = value;
  }

  @action updateLogo = (value: string) => {
    this.logo = value;
  }

  @action updateShortDescription = (value: string) => {
    this.shortDescription = value;
  }

  @action updateLongDescription = (value: string) => {
    this.longDescription = value;
  }

  @action updateLongDescriptionUrl = (value: string) => {
    this.longDescriptionUrl = value;
  }

  @action addRole = (role: string) => {
    //if role already exist leave
    if (this.roles.has(role)) return;

    let NewRole: IServiceRole = {
      luaScript: "__==== your code here ====",
      impersonateWithinRole: false,
      proxy: true,
      isActive: true,
    }
    this.roles.set(role, NewRole);
  }

  @action deleteRole = (role: string) => {
    this.roles.delete(role)
  }

  @action addServiceRole = (role:string) => {
    if(this.serviceRoles.indexOf(role)>-1) return;
    this.serviceRoles.push(role);
    this.serviceRoles.sort();
    this.addRole(role);
  }

  @action deleteServiceRole = (role:string) => {
    const roleIndex = this.serviceRoles.indexOf(role);
    if(roleIndex === -1) return;
    this.serviceRoles.splice(roleIndex, 1);
  }

  @action addToAllRoles = (role:string) => {
    if(this.allRoles.indexOf(role)>-1) return;
    this.allRoles.push(role);
    this.allRoles.sort();
  }

  @action deleteFromAllRoles = (role:string) => {
    const roleIndex = this.serviceRoles.indexOf(role);
    if(roleIndex === -1) return;
    this.allRoles.splice(roleIndex, 1);
  }

  @action moveRoleFromAllToService = (role:string) => {
    this.deleteFromAllRoles(role);
    this.addServiceRole(role);
  }

  @action moveRoleFromServiceToAll = (role:string) => {
    this.deleteServiceRole(role);
    this.addToAllRoles(role);
  }

  @action clientApiGetService = (subDomain:string) => {
    // call "/v1/api/admin/service/{subDomain}"
  }

  @action clientApiSaveService = () => {
    // call "/v1/api/admin/service/save"
  }

  @action clientApiDeleteService = () => {
    // call "/v1/api/admin/service/delete"
  }
}
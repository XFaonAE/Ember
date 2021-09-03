import Cpu from "./Cpu"
import Ram from "./Ram"

export default class System {
    public cpu: Cpu = new Cpu()
    public ram: Ram = new Ram()
}
import { DataSource } from "typeorm"
import CONNECTION from "./dbconnection";

//@ts-ignore
const AppDataSource = new DataSource({
    ...CONNECTION,
     entities: ["*/**/*.entity.ts"],
     migrations: ["src/migrations/*.ts"]
});

AppDataSource.initialize()
             .then(()=>{
                console.log("Ds has been initialized");
             })
             .catch((err)=>{
                console.log("Error during initialization", err);
             });

export default AppDataSource;
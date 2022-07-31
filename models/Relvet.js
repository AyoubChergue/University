
const db = require("./DB/MySqlConnection")


/**
         * @varible Relvet , Semestre, Unity , Module
 

*/

/**
 * Relvet : 
 * 
 * Get all Relvet from Module
 * Get all Unity From module
 */


 const ArchivedTable=(Table,pack,callback)=>{
    if(pack.hasOwnProperty('id')){

        let q = "update "+Table+" set Archived=1  where id"+Table+" = "+pack.id+" ;";
       
        console.log(q)
        db.query(q,(Err,Result)=>{
            if(Err) throw Err;
            callback(null,Result);
        })

    }else{
        callback("id requirement !" , null)
    }
}


const DesarchivedTable = (Table,pack,callback)=>{
    if(pack.hasOwnProperty('id')){

        let q = "update "+Table+" set Archived="+0+" where id"+Table+" = "+pack.id+" ;";
       
        console.log(q)
        db.query(q,(Err,Result)=>{
            if(Err) throw Err;
            callback(null,Result);
        })

    }else{
        callback("id requirement !" , null)
    } 
}



const  AddRelvet = (pack,callback)=>{
    if(pack.hasOwnProperty('idStudent')){   
        let q="";
        if(pack.hasOwnProperty("date")){
             q= "insert into Relvet(date,idStudent) values"
            q+= " ('"+pack.date+"',"+pack.idStudent+");";


        }else{
            q="insert into Relvet(idStudent) values ("+pack.idStudent+");";

        }

        db.query(q,(Err,Result)=>{
            if(Err) throw Err;

            GetRelvet({idRelvet:Result.insertId},(Err,Resultt)=>{
                callback(Err,Resultt);
            })

         
        })

    }else{
        callback("there is no student",null)
    }
}

const GetRelvet = (pack,callback)=>{
    if(pack.hasOwnProperty("idRelvet")){
        let q="select idRelvet,R.date,S.idStudent,concat(S.firstname,' ',S.lastname),S.matricule from Relvet R join Student S on R.idStudent=S.idStudent;";
        db.query(q,(Err,Result)=>{
            if(Err)throw Err;
            if(Result.length ==1){
                callback(null,Result)
            }else{
                callback("no item ",null)
            }
        })
    }else{
        callback("there is no id for relvet",null)
    }
}

const ModifyRelvet =(pack,callback)=>{
    let md = "update Relvet set "; 
    let and=false
    if(pack.hasOwnProperty('date')){
        let q1 = " date = '"+pack.date+"' ";
        if(and){
            md+=" , "+q1;
        }else{
            and=true;
            md+=q1;
        }
     
    }

    if(pack.hasOwnProperty('idStudent')){
        let q1 = " idStudent = "+pack.idStudent+" ";
        if(and){
            md+=" , "+q1;
        }else{
            and=true;
            md+=q1;
        }
     
    }


    if(and && pack.hasOwnProperty('idRelvet')){
        md+=" where idRelvet="+pack.idRelvet;
        db.query(md,(Err,Result)=>{
            if(Err) throw Err;
            callback(null,Result);
        })
    }else{
        callback("there no item to update",null)
    }
}

const ArchivedRelvet = (pack,callback)=>{
    if(pack.hasOwnProperty("idRelvet")){
        ArchivedTable('Relvet',{id:pack.idRelvet},(Err,Result)=>{
            callback(Err,Result);
        })
    }else{
        callback("no id for Relvet",null)
    }
}

const DesArchivedRelvet = (pack,callback)=>{
    if(pack.hasOwnProperty("idRelvet")){
        DesarchivedTable('Relvet',{id:pack.idRelvet},(Err,Result)=>{
            callback(Err,Result);
        })
    }else{
        callback("no id for Relvet",null)
    }
}


// i need method for date search
const SearchMultiRelvet =(pack,callback)=>{
    let Arch = "and U.Archived = 0 ";

    if(pack.hasOwnProperty("Archived")){
        
            Arch = "and U.Archived = 1 "
        
    }else{
        if(pack.hasOwnProperty('All')){
            Arch = " ";
        }
    }

    let q = "select idProfessor,firstname,lastname,matricule,F.idFaculty ,F.name as Faculty,U.idUniversity , U.name as University ,idWilaya, W.name as Wilaya from Professor P join Faculty F join University U join Wilaya W on U.idWilaya=W.idWilaya and P.idFaculty = F.idFaculty and F.idUniversity = U.idUniversity "


    if(pack.hasOwnProperty("date")){
        if(pack.hasOwnProperty('Year')){
            let q1=" and YEAR( R.date) ="+pack.Year+" ";
            q+=q1
        }
        if(pack.hasOwnProperty('Month')){
            let q1=" and MONTH( R.date) ="+pack.Month+" ";
            q+=q1
        }
        if(pack.hasOwnProperty('Day')){
            let q1=" and DAY( R.date) ="+pack.Day+" ";
            q+=q1
        }
    }

    if(pack.hasOwnProperty("idStudent")){
        let q1 = " and S.idStudent  ="+pack.idStudent+" ";
        q+=q1
    }



    db.query(q,(Err,Result)=>{
        if(Err)throw Err;
        callback(Result)
    })
}


// semestre

const AddSemestre=(pack,callback)=>{
    if(pack.hasOwnProperty('idRelvet') && pack.hasOwnProperty('idTypeSemestre')){
        let q = " insert into Semestre(idRelvet,idTypeSemestre) values";
        q+="("+pack.idRelvet+","+pack.idTypeSemestre+");";
        db.query(q,(Err,Result)=>{
            if(Err )throw Err;
           let id = Result.insertId;
           GetSemestre({idSemestre:id},(Err,Res)=>{
            callback(Err,Res)
           })
        })
    }else{
        callback("package not compliter",null)
    }

}
const GetSemestre = (pack,callback)=>{
    if(pack.hasOwnProperty('idSemestre')){
        let q= "select Sm.idSmestre,TS.name as TypeSemestre, R.date,St.firstname,St.lastname,St.matricule,S.name as Speciality,SY.name as StudyYear from Semestre Sm join Relvet R join Student St join idTypeSemestre TS join StudyYear SY join Speciality S on Sm.idRelvet=R.idRelvet and R.idStudent=St.idStudent and TS.idTypeSemestre=Sm.idTypeSemestre and TS.idStudyYear=SY.idStudyYear and SY.idSpeciality=S.idSpeciality and Sm.idSemestre="+pack.idSemestre;
        db.query(q,(Err,Result)=>{
            if(Err)throw Err;
            callback(null,Result);
        })
    }else{
        callback("no id semetre",null);
    }
}

const ArchivedSemestre =(pack,callback)=>{
    if(pack.hasOwnProperty("idSemestre")){
        ArchivedTable('Semestre',{id:pack.idSemestre},(Err,Result)=>{
            callback(Err,Result);
        })
    }else{
        callback("no id for Semestre",null)
    }
}

const DesArchivedSemestre =(pack,callback)=>{
    if(pack.hasOwnProperty("idSemestre")){
        ArchivedTable('Semestre',{id:pack.idSemestre},(Err,Result)=>{
            callback(Err,Result);
        })
    }else{
        callback("no id for Semestre",null)
    }
}

const SearchMultiSemestre= (pack,callback)=>{
    let Arch = "and Archived = 0 ";

    if(pack.hasOwnProperty("Archived")){
        
            Arch = "and Archived = 1 "
        
    }else{
        if(pack.hasOwnProperty('All')){
            Arch = " ";
        }
    }

    let q= "select Sm.idSmestre,TS.name as TypeSemestre, R.date,St.firstname,St.lastname,St.matricule,S.name as Speciality,SY.name as StudyYear from Semestre Sm join Relvet R join Student St join idTypeSemestre TS join StudyYear SY join Speciality S join Departement D on D.idDepartement = S.idDepartement  and  Sm.idRelvet=R.idRelvet and R.idStudent=St.idStudent and TS.idTypeSemestre=Sm.idTypeSemestre and TS.idStudyYear=SY.idStudyYear and SY.idSpeciality=S.idSpeciality " + Arch;

    /**
     * from Semestre Sm join Relvet R 
     * join Student St join idTypeSemestre TS 
     * join StudyYear SY join Speciality S 
     * join Departement D on D.idDepartement = S.idDepartement
     *  
     */

    if(pack.hasOwnProperty('Student')){
        let q1 = " and (ST.firstname like '%"+pack.Student+"%' or ST.lastname like '%"+pack.Student+"%' or concat(ST.firstname,' ',ST.lastname) like '%"+pack.Student+"%' ) "
        q+=q1;
    }

    if(pack.hasOwnProperty('idStudent')){
        let q1=" and ST.idStudent ="+pack.idStudent+" ";
        q+=q1;
    }

    if(pack.hasOwnProperty('StudyYear')){
        let q1=" and SY.name like '%"+pack.StudyYear+"%' ";
        q+=q1;
    }

    if(pack.hasOwnProperty('idStudyYear')){
        let q1=" and SY.idStudyYear ="+pack.idStudyYear+" ";
        q+=q1;
    }
    if(pack.hasOwnProperty('Speciality')){
        let q1=" and S.name like '%"+pack.Speciality+"%' ";
        q+=q1;
    }

    if(pack.hasOwnProperty('idSpeciality')){
        let q1=" and S.idSpeciality ="+pack.idSpeciality+" ";
        q+=q1;
    }

    if(pack.hasOwnProperty('Departement')){
        let q1 = " and D.name like '%"+pack.Departement+"%' "
        q+=q1;
    }


    if(pack.hasOwnProperty('idDepartement')){
        let q1 = " and D.idDepartement ="+pack.idDepartement+" " 
        q+=q1;
    }


    db.query(q,(Err,Result)=>{
        if(Err)throw Err;
        callback(Result)
    })


}

//Unity

const AddUnity =(pack,callback)=>{
    if(pack.hasOwnProperty('idSemestre') && pack.hasOwnProperty("idTypeUnity")){

        let q="insert into Unity (idSemestre,idTypeUnity) values";
        q+=" ("+pack.idSemestre+","+pack.idTypeUnity+") ;"
       
        db.query(q,(Err,Result)=>{
            if(Err)throw Err;
            GetUnity({idUnity:Result.insertId},(Err,Res)=>{
                callback(Err,Res);
            })
        })
      

    }else{
        callback('there is no id Semestre or id Type Unity',null)
    }
}

const GetUnity = (pack,callback)=>{
    if(pack.hasOwnProperty('idUnity')){
        let q = "select U.idUnity,U.Mark,TU.idTypeUnity,TU.name as Unity,TS.idTypeSemestre,TS.name as Semestre, S.idStudent,concat(S.fisrtname,' ',S.lastname) from Unity U join TypeUnity TU join Semestre SM join TypeSemestre TS join Relvet R join Student S on SM.idTypeSemestre= ST.idTypeSemestre and U.idTypeUnity=UT.idTypeUnity and U.idSemestre = SM.idSemestre and SM.idRelvet = T.idRelvet and R.idStudent = S.idStudent ";
        db.query(q,(Err,Result)=>{
            if(Err)throw Err;
            callback(null,Result);
        })
    }else{
        callback("no id Unity",null)
    }
}

module.exports={
    Relvet:{
        AddRelvet,
        GetRelvet,
        ModifyRelvet,
        ArchivedRelvet,
        DesArchivedRelvet,
        SearchMultiRelvet
    },
    Semestre:{
        AddSemestre,
        GetSemestre,
        ArchivedSemestre,
        DesArchivedSemestre,
        SearchMultiSemestre
    }
    ,
    Unity:{
        AddUnity,
        GetUnity
    }
}


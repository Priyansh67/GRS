const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/dbconnect')

const depts = sequelize.define('dept',{
    dept_id:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull:false
    },
    dept_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dept_head:{
        type:DataTypes.STRING,
        allowNull:true
    }
})


const emp = sequelize.define('emp',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    emp_id:{
        type:DataTypes.INTEGER,
        unique:true,        
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    designation:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dept_id:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:depts,
            key:'dept_id'
        }
    },
    scores:{
        type:DataTypes.INTEGER
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
    }
})

const admins = sequelize.define('admin',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    emp_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    desig:{
        type:DataTypes.STRING,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
})

const students = sequelize.define('student',{
    enroll_no:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    branch:{
        type:DataTypes.STRING
    },
    course:{
        type:DataTypes.STRING
    },
    semester:{
        type:DataTypes.INTEGER
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
    }
})

const compltDom = sequelize.define('compltDom',{
    domId:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull:false
    },
    domainName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    totIssues:{
        type:DataTypes.INTEGER,
    },
    totUnResolved:{
        type:DataTypes.INTEGER,
    }
})




const complaints = sequelize.define('complaint',{
    complaint_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    issue:{
        type:DataTypes.STRING,
    },
    description:{
        type:DataTypes.STRING
    },
    domId:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:compltDom,
            key:'domId'
        }
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dept_id:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:depts,
            key:'dept_id'
        }
    }
})


const studentComplaints = sequelize.define('studentComplaint',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    complaint_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:complaints,
            key:'complaint_id'
        }
    },
    stu_id:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:students,
            key:'enroll_no'
        }
    },
    upvotes:{
        type:DataTypes.INTEGER
    }
})



module.exports = {
    depts,
    emp,
    admins,
    students,
    compltDom,
    complaints
}




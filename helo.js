const client = require("./redis-client");

async function init() {
  let obj = {
    name: "karan singh",
    gender: "male",
    company: "invansys",
    phone: 9978999999,
    location: `POINT(12.3892423,24.234)`,
    email: "kannuurawat18@gmail.com",
  };
    const key = `user:kannuurawat1f3@gmail.com`;
    //const val = await client.expire(hashkey,10);
    // console.log(val);
//    const res =  await client.set(key,JSON.stringify(obj));
const resobj = await client.get(key,(err,res)=>{
    if(err){

    }else{
        return res;
    }
})
const res = JSON.parse(resobj);
   console.log(res)

    // const sobj = await client.get(hashkey, specificField, (err,result)=>{
    //  if(err){
    //   console.log('error occurred')
    //  }else{
    //   return result
    //  }
    // });
    // const res = JSON.parse(sobj)
    // if(!res){
    //   console.log('nothing to compute')
    //   return
    // }
    // console.log(res)
}
init();

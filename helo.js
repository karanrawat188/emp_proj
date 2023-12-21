const ESbulk=[]


ESbulk.push(
    {update:{_index: "employees", _id:434}},
    {doc:{firstName: "karan"}}
  )    
          ESbulk.push(
    {update:{_index: "employees", _id:5}},
    {doc:{firstName:"karan"}}
  )
              ESbulk.push(
    {update:{_index: "employees", _id:7}},
    {doc:{firstName:"karan"}}
  ) 
             ESbulk.push(
    {update:{_index: "employees", _id:765}},
    {doc:{firstName: "karan"}}
  )
              ESbulk.push(
    {update:{_index: "employees", _id:567}},
    {doc:{firstName: "karan"}}
  )

  console.log(ESbulk)
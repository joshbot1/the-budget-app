
//main calculation
var budgetController = (function(){
    var Expense = function(ID,description,value){
       this.id = ID;
       this.description = description;
       this.value = value;
       this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalincome){

        if(totalincome > 0){
          this.percentage = Math.round((this.value/totalincome) *100);
           }else{

            this.percentage = -1;
           }


    };

    Expense.prototype.getPerc = function(){
        return this.percentage;


    };

    
    var income = function(ID,description,value){
        this.id = ID;
        this.description = description;
        this.value = value;
 
     };

     var calcluateTotal = function(type){
         
        var sum = 0;

        data.allitem[type].forEach(function(cur) {
            sum += cur.value; // sum = sum + cur.value (cur=current value)
             
        });
         data.totals[type] = sum;

     };


//empty array to insert the values 
     var data = {
         allitem:{
             exp: [],
             inc: []
         },
         totals:{
             exp: 0,
             inc: 0
         },
         Budget : 0,
         
         percentage: -1

     };

     return {

        additem: function(type,des,val){

         var newItem , ID;
         //add ID for each item
         if(data.allitem[type].length > 0)
         {
         ID = data.allitem[type][data.allitem[type].length - 1].id + 1;
          }
          else
          {
              ID = 0;
          }

          //add new item using type
         if(type === 'exp'){
            newItem = new Expense(ID,des,val);
          }else if (type === 'inc'){
              newItem = new income(ID,des,val);
          }
          //intersting item in data structure
          data.allitem[type].push(newItem);
          return newItem;
        },

        deleteItem: function(type,id){
            var ids, index;

            ids = data.allitem[type].map(function(current) {
                return current.id;
                
                });
                index = ids.indexOf(id);

                if(index !== -1){

                    data.allitem[type].splice(index,1);
                }

                
            
        },

        calculateBudget: function(){

            //calculate income and expense sum
            calcluateTotal('exp');
            calcluateTotal('inc');

            //calculate the budget

            
            data.budget = data.totals.inc - data.totals.exp;
            

            //calculate the percentage
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
             }else{
               data.percentage = -1;
                  }


        },

        calculatePercentages: function(){

            data.allitem.exp.forEach(function(cur){
                    
                cur.calcPercentage(data.totals.inc);


            });


        },

         getpercentages: function(){
 
            var getperc = data.allitem.exp.map(function(cur){

                return  cur.getPerc();
            });
           return getperc;
         },


        getbudget: function(){
         return{
             totalbudget: data.budget,
             totalperc: data.percentage,
             totalincome: data.totals.inc,
             totalexpense: data.totals.exp
         };

        },


        testing: function(){
            console.log(data);
        }
        
     };
    
})();

var UIcontroller = (function(){
//storing of DOMstrings
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputadd: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerckLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

};

var formatNumber = function(num, type){
          
    //adding minor details to the project
    //1. + and - before a number
    //2. 2 decimal point to align
    //3. comma seprating thousands

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if(int.length > 3){

        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 50000 , output - 50,000
    }

    dec = numSplit[1];

    return(type === 'exp'? '-' : '+') + ' '+ int + '.'+ dec;


}


var nodelistForeach = function(list, callback){

    for(var i = 0; i < list.length; i++){

        callback(list[i],i);
    }
};

  return {
      getInput: function(){
          return{
    type: document.querySelector(DOMstrings.inputType).value,
    description:document.querySelector(DOMstrings.inputDescription).value,
    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
    
};
},

addlistItem: function(obj,type){
    var html,newHtml,element;
//create HTML string with placeholder text
if(type === 'inc'){
    element = DOMstrings.incomeContainer;
html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}else if(type === 'exp'){
    element = DOMstrings.expenseContainer;
html ='<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}
//replace the placeholder text with some actual value
newHtml = html.replace('%id%',obj.id);
newHtml = newHtml.replace('%description%',obj.description);
newHtml = newHtml.replace( '%value%',formatNumber(obj.value, type));

//insert actual HTML into DOM
document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

},

deletelistitem: function(selectorID){

    var el = document.getElementById(selectorID);

   el.parentNode.removeChild(el);

},

clearFields: function(){
var fields, fieldsArr;

fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
fieldsArr = Array.prototype.slice.call(fields);
//loop to clear parameters
fieldsArr.forEach(function(current,index,array){
current.value = "";
});
fieldsArr[0].focus();

},
//to display the values in the UI
displayBudget: function(obj){
      var type;

      obj.totalbudget > 0 ? type ='inc' : type ='exp';

    document.querySelector(DOMstrings.budgetLabel).textContent = '₹' + formatNumber(obj.totalbudget,type);
    document.querySelector(DOMstrings.incomeLabel).textContent = '₹' +formatNumber(obj.totalincome,'inc');
    document.querySelector(DOMstrings.expenseLabel).textContent = '₹' +formatNumber(obj.totalexpense,'exp');


    if(obj.totalperc > 0){
    document.querySelector(DOMstrings.percentageLabel).textContent = obj.totalperc + '%';
    }else{
    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
    }
},

displayPercentages: function(percentages){

    var fields = document.querySelectorAll(DOMstrings.expensesPerckLabel);


   

    nodelistForeach(fields,function(current,index){


        if(percentages[index] > 0){

            current.textContent = percentages[index] + '%';
        }else{
            current.textContent = '---';
        }


    });

},
displayDate: function(){

    now = new Date();

    months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
    month = now.getMonth();

    year = now.getFullYear();
    document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year; 
    

},
changedType: function(){

    var fields = document.querySelectorAll(

        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription+ ',' +
        DOMstrings.inputValue);

        nodelistForeach(fields, function(cur){

            cur.classList.toggle('red-focus');
          });

          Document.querySelector(DOMstrings.inputadd).classList.toggle('red');


},



//making DOMstrings publicly avaiable 
getDomstring: function(){

    return DOMstrings;
}
}

})();
//this links the UI & the budgetController module
var controller = (function(budgetcntrl,UIcntrl){
    

    var setupeventlistener = function(){

        var DOM = UIcntrl.getDomstring();

        document.querySelector(DOM.inputadd).addEventListener('click',ctrladd);
        document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13){
        ctrladd();        
        }

    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteIteam);
    document.querySelector(DOM.inputType).addEventListener('change',UIcntrl.changedType);
        
    }

    var updateBudget = function(){
        //1. calculate the budget
        budgetcntrl.calculateBudget();  
        //2. return budget
        var budget = budgetcntrl.getbudget();
        //3. display the budget on the UI
        UIcntrl.displayBudget(budget);


    };

    var updatepercentages = function(){

        //1. calculate percentages

        budgetcntrl.calculatePercentages();

        //2. read percentages
        var readPerc = budgetcntrl.getpercentages();

        //3. update the UI with new percentages
         UIcntrl.displayPercentages(readPerc);


    };

    var ctrladd = function(){
           var input,newItem ;
         //1. get the input field
          input = UIcntrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        //2. add the item to the budgetcontroller
          newItem = budgetcntrl.additem(input.type,input.description,input.value);
        //3. add the item to the UI
        UIcntrl.addlistItem(newItem,input.type);
        //4. clearing fields
        UIcntrl.clearFields();
          
        //5. calculate and update budget
        updateBudget();

        //6. calculate and update percentages
        updatepercentages();
        }
    };

   var ctrlDeleteIteam = function(event){
        var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){

        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        //1. delte the item from the data structure
        budgetcntrl.deleteItem(type,ID);

        //2. delete the item from the UI
        UIcntrl.deletelistitem(itemID);

        //3. update and show the budget
        updateBudget();
    }

    };
    
    return {

        init: function(){

            //call this function in init() so when we open app the values set to default = 0
            UIcntrl.displayBudget(totalbudget = 0,
                totalperc = 0,
                totalincome = 0,
                totalexpense = -1);
                UIcntrl.displayDate();
            setupeventlistener();
            console.log('it has started');
        }
    }

})(budgetController,UIcontroller);

controller.init();
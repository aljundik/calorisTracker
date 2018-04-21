const ctrItem = (() => {
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
        // {
        //     id: 0,
        //     name: 'meat',
        //     calories: 300
        // },
        // {
        //     id: 1,
        //     name: 'Fruit',
        //     calories: 30
        // },
        // {
        //     id: 2,
        //     name: 'Eggs',
        //     calories: 90
        // }
    ],
    currentItem: null,
    currentCalories: 0
};


    return {
        logData: () => console.log(data),
        getItems: () => data.items,
        addItemToDb: (name, calories) => {
            let id;
            if(data.items.length>0){
                id = data.items[data.items.length -1].id + 1;
            } else {
                id = 0;
            }
             
            const item = new Item(id,name,calories);

            data.items.push(item);


            return item;
            
        },
        deleteItem: function(item){
            data.items.forEach(function(element,index){
                if(item.id === element.id){
                    data.items.splice(index,1);
                }
            })
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(item => {
                total+=item.calories;
            });

            return total;

        },
        setCurrentItem: function(id){
            item = null;

            data.items.forEach(function(element){
                if(element.id === id){
                    item = element;
                }
            });

            data.currentItem = item;
        },
        getCurrentItem: function(id){
            return data.currentItem;
        },
        updateItemsInDb: function(values){
            let item = null;
            const id = ctrItem.getCurrentItem();
            data.items.forEach(function(element){
                if(element.id === id.id ){
                    element.name = values.name;
                    element.calories = values.calories;
                    item = element;
                }
            });

            return item;
        } 
    }
})();


const ctrUI = (() => {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',        
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories'
    };
    return {
        createListOfItems: (items) => {
            html = '';

            items.forEach(element => {
                html+=`
                <li class="collection-item" id="item-${element.id}">
                <strong>${element.name}: </strong> <em>${element.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>
                
                `
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;



        },
        getUISelectors: function(){
            return UISelectors;
        },

        getValues: function(){
            const name = document.querySelector(UISelectors.itemName).value;
            let calories = document.querySelector(UISelectors.itemCalories).value;



            if(name === '' || calories === ''){
                console.log('can not be empty');
            } else {
                calories = parseInt(calories);
                return {name, calories};

            }
        },

        addToList: function(item){
        const li = document.createElement('li');

        li.className = 'collection-item';
        li.id = `item-${item.id}`;
        li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;

        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeEnd',li);
        
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        showTotalCalories: (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },displayUpdate: function(currentItem){
            document.querySelector(UISelectors.itemName).value = currentItem.name;
            document.querySelector(UISelectors.itemCalories).value = currentItem.calories;

            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        clearEdit(){
            ctrUI.clearInput();
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'block';
            
        }
    }
})();






const app = ((ctrItem,ctrUI) => {
    const loadEventListners = function(){
        const UISelectors = ctrUI.getUISelectors();
       document.querySelector(UISelectors.addBtn).addEventListener('click',addItem);
       document.addEventListener('keypress', function(e){
           if(e.keyCode === 13 || e.which === 13){
               e.preventDefault();
               return false;
           }
       })
       document.querySelector(UISelectors.itemList).addEventListener('click', updateItem);
       document.querySelector(UISelectors.updateBtn).addEventListener('click', updateButtonClicked);
       document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteButtonClicked);
       
       
        
       

    }

    function updateButtonClicked(e) {
        const values = ctrUI.getValues();
        const updateItem = ctrItem.updateItemsInDb(values);
        const items = ctrItem.getItems();
        ctrUI.createListOfItems(items);
        const totalCalories = ctrItem.getTotalCalories();
        ctrUI.showTotalCalories(totalCalories);
        ctrUI.clearEdit();
        e.preventDefault();
        
    }


    function deleteButtonClicked(e) {

        const item = ctrItem.getCurrentItem();
        ctrItem.deleteItem(item);
        const items = ctrItem.getItems();
        ctrUI.createListOfItems(items);
        const totalCalories = ctrItem.getTotalCalories();
        ctrUI.showTotalCalories(totalCalories);
        ctrUI.clearEdit();
        e.preventDefault();
        
    }


    function addItem(e){

        const values = ctrUI.getValues();
        const items = ctrItem.addItemToDb(values.name, values.calories);

        ctrUI.addToList(items);

        const totalCalories = ctrItem.getTotalCalories();
        ctrUI.showTotalCalories(totalCalories);



    

        ctrUI.clearInput();
        e.preventDefault();
    }

    function updateItem(e){
        if(e.target.classList.contains('edit-item')){
            const itemIdString = e.target.parentNode.parentNode.id;
            const itemId  = itemIdString.split('-');
            const id = parseInt(itemId[1]);
            
            ctrItem.setCurrentItem(id);
            const currentItem = ctrItem.getCurrentItem(id);
            
            ctrUI.displayUpdate(currentItem);
        }
    }


    return{
        init: () => {
            ctrUI.clearEdit();
            const items = ctrItem.getItems();

            ctrUI.createListOfItems(items);
            
            



            loadEventListners();
        }
    }
})(ctrItem,ctrUI);


app.init();
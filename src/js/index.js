import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
// search why we need {} for importing elements
import { elements, renderLoader, clearLoader } from './views/base';

/*Global state of the app 
 * - Seach object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state={};
/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () =>{
    // 1) get a query from the view
     const query=searchView.getInput();
    //  console.log(query);
    //  const query= 'pizza'; // todo in searchView part\
     if(query){
           //  2) New search Object and add to state
           state.search= new Search(query);

           // 3) Prepare UI fo results todo
           searchView.clearInput();
           searchView.clearResults();
           renderLoader(elements.searchResults);
         try{
            // 4) searh for recipes
            /*so we want the rendering of the results only to happen after we actually receive the results from the API, 
            so await this promise simply use await here*/
            //  this returns a promise because getResults() is an async method and async method always returns a promise
           await state.search.getResults();

            // 5) Render results on UI
            clearLoader();

            //  from model console.log(state.search.result);
            searchView.renderResults(state.search.result);
         }
         catch(err){
            alert("Something wrong with the search");
            clearLoader();
         }                 
     }
}
elements.searchForm.addEventListener('submit', e=>{
    // we don't want to happen default
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click',e => {
    // using closest method
    const btn= e.target.closest('.btn-inline');
    if(btn) {
    // dataset a handy to having access to data we can chage 'goto' to from which element we want to get the data
        const goToPage= parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
// for only testing
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    // get id from URL
    const id= window.location.hash.replace('#','');
    console.log(id);
    if(id){
        // prepare UI for changes
        // Create new Recipe Object
        state.recipe =new Recipe(id);
        try{
           // get the new recipe data
         await state.recipe.getRecipe();
         // calculate serving and time
         state.recipe.calcTime();
         state.recipe.calcServings();
         // Render Recipe
         console.log(state.recipe);
        }
        catch(err){
            alert("error processing recipe");
        }   
    }
}

// window.addEventListener('hashchange', controlRecipe);
// so that after bookmark when the users search the recipe should be there
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));





























// import axios from 'axios';

// const getResults=async (query)=> {
//     // now use axios to do our Ajax call
//     // that's how we handle promises with async await 
//     try{
//         const result=await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
//     const recipes= result.data.recipes;
//     console.log(recipes); 
//     }
//     catch(err){
//         alert(err);
//     }      
// }

// getResults('pepperoni');
// https://forkify-api.herokuapp.com/api/search


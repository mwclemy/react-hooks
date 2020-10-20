import React, {useReducer, useEffect, useCallback, useMemo} from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Not supported!!')
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIndentifier, clear} = useHttp();

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-21052.firebaseio.com/ingredients.json', 
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://react-hooks-21052.firebaseio.com/ingredients/${id}.json`, 
      'DELETE',
      null,
      id,
      'DELETE_INGREDIENT'
    );
  }, [sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && reqIndentifier === 'DELETE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra });
    }
    else if (!isLoading && !error &&  reqIndentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: {...reqExtra, id: data.name} });
    }
  },[data, reqExtra, reqIndentifier, isLoading, error]);

  
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients });
  }, []);

  const ingredientList = useMemo(() => (
    <IngredientList ingredients={userIngredients}
                        onRemoveItem={id => removeIngredientHandler(id)}/>
  ),[userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={ingredient => addIngredientHandler(ingredient)}
                      isLoading={isLoading}/>
      <section>
        <Search filteredIngredients={filteredIngredientsHandler}/>
        {ingredientList}
        
      </section>
    </div>
  );
}

export default Ingredients;

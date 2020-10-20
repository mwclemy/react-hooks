import React,{useState, useEffect, useRef} from 'react';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {
  const {filteredIngredients}  = props;
  const [filterTitle, setFilterTitle] = useState('');
  const inputRef = useRef();
  const {isLoading, error, data, sendRequest, clear} = useHttp();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterTitle === inputRef.current.value) {
        const query = filterTitle.length === 0 
        ? '' 
        : `?orderBy="title"&equalTo="${filterTitle}"`;

        sendRequest('https://react-hooks-21052.firebaseio.com/ingredients.json'+ query, 'GET');
      }
    },500);
    return () => {
      clearTimeout(timer);
    }
  },[filterTitle, sendRequest]);

  useEffect(() => {
    const ingredientsArr = []
    if (!isLoading && !error && data) {
      for (let key in data) {
        ingredientsArr.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      filteredIngredients(ingredientsArr);
    }
  }, [isLoading, error, data,filteredIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input type="text"
                 ref={inputRef} 
                 value={filterTitle} 
                 onChange={event => setFilterTitle(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;

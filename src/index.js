import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles';
import GridItems from './components/GridItems';
import LeftNav from './components/LeftNav';
import TopNav from './components/TopNav';
import gridItemsData from './data/gridItems';
import leftNavData from './data/leftNav';
import topNavData from './data/topNav';

function App() {
  return (
    <div className={`${styles.root}`}>
      <TopNav items={topNavData} />
      <div className="body">
        <LeftNav items={leftNavData} />
        <GridItems items={gridItemsData} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

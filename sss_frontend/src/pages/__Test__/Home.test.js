import { shallow } from 'enzyme';
import Home from '../Home';
import renderer from 'react-test-renderer';

it('renders Home page without crashing', () => {
    shallow(<Home />);    
});

it('snapshot with no content matches', () => {
    const page = renderer.create(<Home />).toJSON();
    expect(page).toMatchSnapshot();
});

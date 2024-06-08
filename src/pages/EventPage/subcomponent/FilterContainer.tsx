import classNames from 'classnames/bind'
import styles from '../EventPage.module.css'
import SortSelect from '../../../components/SortSelect/SortSelect'
import { TagFilter } from '../../../components/TagFilter/TagFilter'

interface Props {}

const FilterContainer = (props: Props) => {
  const sx = classNames.bind(styles)
  return (
    <div className={sx("filterContainer")}>
          <SortSelect />
          <TagFilter />
        </div>
  )
}

export default FilterContainer
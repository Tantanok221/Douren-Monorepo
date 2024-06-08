import classNames from 'classnames/bind'
import styles from '../EventPage.module.css'
import SelectComponent from '../../../components/SelectComponent/SelectComponent'
import { useState } from 'react'
import SearchBox from '../../../components/SearchBox/SearchBox'

interface Props {}

const SearchContainer = (props: Props) => {
  const sx = classNames.bind(styles)
  const [searchSelectValue, setSearchSelectValue] = useState("booth");
  return (
    <form id="top" className={sx("searchContainer")}>
          <div className={sx("searchFilter")}>
            <SelectComponent
              onValueChange={setSearchSelectValue}
              defaultValue={searchSelectValue}
            >
              <SelectComponent.Group>
                <SelectComponent.Label text="搜尋欄位" />
                <SelectComponent.Item text="攤位名稱" value="booth" />
                <SelectComponent.Item text="創作者名稱" value="owner" />
                <SelectComponent.Item text="攤位位置" value="location" />
              </SelectComponent.Group>
            </SelectComponent>
          </div>
          <div className={sx("searchBox")}>
            <SearchBox />
          </div>
        </form>
  )
}

export default SearchContainer
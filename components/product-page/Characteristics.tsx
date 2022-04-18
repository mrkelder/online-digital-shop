import { FC } from "react";

import useLanguage from "hooks/useLanguage";
import styles from "styles/item-page.module.css";
import DTO from "utils/DTO";

interface Props {
  characteristics: Item["characteristics"];
}

const Characteristics: FC<Props> = ({ characteristics }) => {
  const { langVariant } = useLanguage();

  return (
    <table className={styles["table"]}>
      <tbody>
        {characteristics.map(({ c, values }, index) => (
          <tr key={`c_${index}`} className={styles["tr-c"]}>
            <th className={styles["th-name-c"]}>
              {langVariant(c.name.ua, c.name.ru)}
            </th>
            <th className={styles["th-value-c"]}>
              {DTO.mongodbCharacteristicValueToString(c.values, values)}
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Characteristics;

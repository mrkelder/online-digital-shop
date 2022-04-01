import { FC } from "react";

import styles from "styles/item-page.module.css";
import DTO from "utils/DTO";

const Characteristics: FC<{ characteristics: Product["characteristics"] }> = ({
  characteristics
}) => {
  return (
    <table className={styles["table"]}>
      <tbody>
        {characteristics.map(({ c, values }, index) => (
          <tr key={`c_${index}`} className={styles["tr-c"]}>
            <th className={styles["th-name-c"]}>{c.name}</th>
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

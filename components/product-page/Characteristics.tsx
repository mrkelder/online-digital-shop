import { FC } from "react";

import styles from "styles/item-page.module.css";

const Characteristics: FC<{ characteristics: Product["characteristics"] }> = ({
  characteristics
}) => {
  return (
    <table className={styles["table"]}>
      <tbody>
        {characteristics.map(c => (
          <tr key={c.id} className={styles["tr-c"]}>
            <th className={styles["th-name-c"]}>{c.name}</th>
            <th className={styles["th-value-c"]}>{c.value}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Characteristics;

import Header from "../Header/Header";
import styles from "./Layout.module.scss";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header></Header>
      <div className={styles.container}>{children}</div>
    </>
  );
}

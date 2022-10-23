/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    document.querySelector('.sidebar-toggle').onclick = (e) => {
      e.preventDefault();
      const body = document.querySelector('.sidebar-mini');
      if (body.classList.contains('sidebar-open')) {
        
        body.classList.remove('sidebar-open', 'sidebar-collapse');
      } else body.classList.add('sidebar-open', 'sidebar-collapse');
    } 
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  /* Обработка кнопки Вход*/
  static initAuthLinks() {
    document.querySelector('.menu-item_login > a').onclick = e => {
      App.getModal('login').open();
      return false;
    }
    /* Обработка кнопки Регистрация*/
    document.querySelector('.menu-item_register > a').onclick = e => {
      e.preventDefault();
      App.getModal('register').open();
    }
    /* Обработка кнопки Выход*/
    document.querySelector('.menu-item_logout > a').onclick = e => {
      e.preventDefault();
      User.logout((err, resp) => {
        if (resp && resp.success) {
          App.setState('init');
        }
      })
    }
  }
}
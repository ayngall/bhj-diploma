/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) throw new Error('Элемент не существует!');
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions){
      let options = this.lastOptions
      this.render(options);
    } else this.render(null);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelector('.remove-account').onclick = e => {
      e.preventDefault;
      this.removeAccount();
    }

    this.element.onclick = e => {
      e.preventDefault();
      const element = e.target.closest('.transaction__remove');
      if (element) this.removeTransaction(element.dataset.id); 
    }        

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
     let data = this.lastOptions.account_id;
      let conf = confirm('Хотите удалить счёт?')
      if (conf) {
        
        console.log(data);        
        Account.remove({id: data}, (err, response) => {
          if (response && response.success) {
            console.log('удалено!');
            App.updateWidgets();
            App.updateForms();
            this.clear();
          } if (err) return err;
        });
      }
    } else console.log('return');
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let conf = confirm('Хотите удалить эту транзакцию?')
    if (conf) {
      Transaction.remove ({id: id}, (err, response) => {
        if (response && response.success) {
          App.update();
        } if (err) return err;
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) return;
    this.lastOptions = options;
    console.log(options) 
    let id = options.account_id;
    console.log(id);


    Account.get(id, (err, response) => {
      if (response) {
        let name = response.data.name;
        console.log(name + ' - имя в запросе');
        this.renderTitle(name);        
        } else return err;
    })

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      } else return err;
    })
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let year = date.substring(0, 4);
    let monthNumber = date.substring(5, 7);
    let day = date.substring(8, 10);
    let time = date.substring(11, 16);
    const months = {
      '01': 'Января',
      '02': 'Февраля',
      '03': 'Марта',
      '04': 'Апреля',
      '05': 'Мая',
      '06': 'Июня',
      '07': 'Июля',
      '08': 'Августа',
      '09': 'Сентября',
      '10': 'Октября',
      '11': 'Ноября',
      '12': 'Декабря'
    };
    return `"${day} ${months[monthNumber]} ${year} г. в ${time}"`;

  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {    
     return `<div class="transaction transaction_${item.type} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
                </div>
               <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <!-- дата -->
                  <div class="transaction__date">${this.formatDate(item.created_at)}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="transaction__summ">
              <!--  сумма -->
              ${item.sum} <span class="currency">₽</span>
              </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <!-- в data-id нужно поместить id -->
                <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                    <i class="fa fa-trash"></i>  
                </button>
            </div>
          </div> `

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const sectionContent = document.querySelector('.content');
    sectionContent.replaceChildren()
    data.forEach(item => {
      sectionContent.insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    })
    

  }
}
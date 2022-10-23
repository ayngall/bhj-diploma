/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, response) => {
      if (response && response.data) {
        let select = this.element.querySelector('.accounts-select');
        select.replaceChildren()
        response.data.forEach(item => {
          select.insertAdjacentHTML('beforeend',
            ` <option value="${item.id}">${item.name}</option>`
          )
        })
      } else console.error(err);
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.update();
        this.element.reset();
      } else console.error(err);
    });
  }
}
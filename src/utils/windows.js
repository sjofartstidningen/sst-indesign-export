import i18n from './i18n';

const translate = i18n($.locale);

function setupButtonGroup(inst) {
  const buttonGroup = inst.add('group');
  buttonGroup.alignment = 'right';

  const buttonOk = buttonGroup.add('button', undefined, translate('Ok'), {
    name: 'ok',
  });

  const buttonCancel = buttonGroup.add(
    'button',
    undefined,
    translate('Cancel'),
    { name: 'cancel' },
  );

  return {
    group: buttonGroup,
    ok: buttonOk,
    cancel: buttonCancel,
  };
}

function setupInputGroup({ label }, inst) {
  const inputGroup = inst.add('group');
  inputGroup.alignment = 'left';

  const inputLabel = inputGroup.add('statictext', undefined, label);

  return { group: inputGroup, label: inputLabel };
}

function createErrorWindow({
  name = translate('An error occured'),
  size,
  label,
}) {
  const window = new Window('dialog', name, size);
  const labelGroup = window.add('group');
  labelGroup.alignment = 'left';
  labelGroup.add('statictext', undefined, label);

  const { group } = setupButtonGroup(window);
  const helpButton = group.add('button', undefined, translate('View help'));
  helpButton.addEventListener('click', () => window.close());

  return {
    show() {
      const result = window.show();
      return { cancel: result === 2, viewHelp: result === 0 };
    },
    close() {
      window.close();
    },
  };
}

function createInputWindow({ name, size, label, initial }) {
  const window = new Window('dialog', name, size);

  const { group } = setupInputGroup({ label }, window);

  const input = group.add('edittext', undefined, initial);
  input.characters = 20;

  const { ok: buttonOk } = setupButtonGroup(window);

  return {
    show() {
      input.active = true;
      const result = window.show();
      return {
        cancel: result === 2,
        value: input.text,
      };
    },
    close() {
      window.close();
    },
    validateInput(validator) {
      input.onChanging = () => {
        const valid = validator(input.text);
        buttonOk.enabled = valid;
      };

      const initialValid = validator(input.text);
      buttonOk.enabled = initialValid;
    },
  };
}

function createDropdownWindow({ name, size, label, items, initial = 0 }) {
  const window = new Window('dialog', name, size);

  const { group } = setupInputGroup({ label }, window);
  const dropdown = group.add('dropdownlist', undefined, items);
  dropdown.selection = initial;
  dropdown.characters = 20;

  setupButtonGroup(window);

  return {
    show() {
      const result = window.show();
      return {
        cancel: result === 2,
        value: dropdown.selection.text,
        index: dropdown.selection.index,
      };
    },
    close() {
      window.close();
    },
  };
}

function createProgressbarWindow({ name, size, label, max }) {
  const window = new Window('window', name, size, { independent: true });

  const labelGroup = window.add('group');
  labelGroup.add('statictext', undefined, label);

  const progressbarGroup = window.add('group');
  const progressbar = progressbarGroup.add(
    'progressbar',
    [15, 15, 250, 35],
    0,
    max,
  );
  const progressbarText = progressbarGroup.add(
    'statictext',
    [15, 15, 75, 35],
    `0 ${translate('of')} ${max}`,
  );

  return {
    show() {
      window.show();
    },
    close() {
      window.close();
    },
    increase() {
      progressbar.value += 1;
      progressbarText.text = `${progressbar.value} ${translate('of')} ${max}`;
    },
  };
}

function createFolderChooser({ label }) {
  const selection = Folder.selectDialog(label);

  return {
    cancel: selection == null,
    value: selection,
  };
}

export {
  createErrorWindow,
  createInputWindow,
  createDropdownWindow,
  createProgressbarWindow,
  createFolderChooser,
};

import katex from 'katex';
import 'katex/dist/katex.min.css';

class InlineMathTool {
  static get isInline() {
    return true;
  }

  static get title() {
    return 'LaTeX';
  }

  static get sanitize() {
    return {
      span: {
        'data-formula': true,
      },
    };
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = 'LaTeX';
    this.button.classList.add('latex-tool-button');
    return this.button;
  }

  surround(range) {
    if (this.api.selection.isCollapsed) {
      return;
    }

    const selectedText = range.extractContents();
    const span = document.createElement('span');

    span.classList.add('latex-inline');
    const formula = selectedText.textContent.trim();
    span.setAttribute('data-formula', formula);
    range.deleteContents();
    range.insertNode(span);

    this.renderFormula(span);

    span.addEventListener('dblclick', () => {
      this.showModal(span);
    });
  }

  checkState(selection) {
    const parent = selection.anchorNode.parentElement;
    this.button.classList.toggle('active', parent && parent.closest('span.latex-inline'));
  }

  renderFormula(span) {
    try {
      const formula = span.getAttribute('data-formula') || '';
      span.innerHTML = ''; // Clear the span's content before rendering
      katex.render(formula, span, {
        throwOnError: false,
      });
    } catch (error) {
      span.textContent = error.message;
    }
  }

  showModal(span) {
    const modal = document.createElement('div');
    modal.classList.add('latex-modal');

    const textarea = document.createElement('textarea');
    textarea.value = span.getAttribute('data-formula') || '';
    modal.appendChild(textarea);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    modal.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    modal.appendChild(cancelButton);

    saveButton.addEventListener('click', () => {
      span.setAttribute('data-formula', textarea.value);
      this.renderFormula(span);
      document.body.removeChild(modal);
    });

    cancelButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
  }
}

export default InlineMathTool;

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RefObject } from 'react';

// Exportar a interface para que possa ser usada em outros arquivos
export interface TimeInputProps {
  ref?: RefObject<TimeInputRef>;
  value?: string; // Formato "HH:MM"
  onChange?: (time: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  // Novos props para navegação externa
  onNavigateNext?: () => void; // Chamado quando deve ir para o próximo campo
  onNavigatePrevious?: () => void; // Chamado quando deve ir para o campo anterior
}

// Interface para métodos expostos via ref
export interface TimeInputRef {
  focusStart: () => void; // Foca no início (horas)
  focusEnd: () => void;   // Foca no final (minutos)
}

const TimeInput = forwardRef<TimeInputRef, TimeInputProps>(({
  value = '',
  onChange,
  onBlur,
  placeholder = '00:00',
  disabled = false,
  className = '',
  onNavigateNext,
  onNavigatePrevious
}, ref) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [focusedField, setFocusedField] = useState<'hours' | 'minutes' | null>(null);
  
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [placeholderHours, placeholderMinutes] = placeholder.split(':');

  // Expor métodos via ref
  useImperativeHandle(ref, () => ({
    focusStart: () => {
      hoursRef.current?.focus();
      setTimeout(() => {
        if (hoursRef.current) {
          hoursRef.current.setSelectionRange(0, 0);
        }
      }, 0);
    },
    focusEnd: () => {
      minutesRef.current?.focus();
      setTimeout(() => {
        if (minutesRef.current) {
          const length = minutesRef.current.value.length;
          minutesRef.current.setSelectionRange(length, length);
        }
      }, 0);
    }
  }));

  // Sincronizar com o valor externo
  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      setHours(h || '');
      setMinutes(m || '');
    } else if (!value) {
      setHours('');
      setMinutes('');
    }
  }, [value]);

  // Formatar e validar horas
  const formatHours = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''));
    if (isNaN(num)) return '';
    if (num > 23) return '23';
    return num.toString().padStart(2, '0');
  };

  // Formatar e validar minutos
  const formatMinutes = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''));
    if (isNaN(num)) return '';
    if (num > 59) return '59';
    return num.toString().padStart(2, '0');
  };

  // Chamar onChange quando houver mudanças
  const updateTime = (newHours: string, newMinutes: string) => {
    if (onChange && (newHours || newMinutes)) {
      const h = newHours ? newHours.padStart(2, '0') : '00';
      const m = newMinutes ? newMinutes.padStart(2, '0') : '00';
      const formattedTime = `${h}:${m}`;
      onChange(formattedTime);
    }
  };

  // Criar evento sintético para compatibilidade com onBlur do Input
  const createSyntheticBlurEvent = (field: 'hours' | 'minutes'): React.FocusEvent<HTMLInputElement> => {
    const currentTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    const ref = field === 'hours' ? hoursRef : minutesRef;
    
    return {
      target: { 
        value: currentTime, 
        name: ref.current?.name || '' 
      },
      currentTarget: { 
        value: currentTime, 
        name: ref.current?.name || '' 
      },
      relatedTarget: null,
      type: 'blur',
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      nativeEvent: {} as FocusEvent,
      preventDefault: () => {},
      isDefaultPrevented: () => false,
      stopPropagation: () => {},
      isPropagationStopped: () => false,
      persist: () => {},
      timeStamp: Date.now()
    } as React.FocusEvent<HTMLInputElement>;
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    
    // Permitir digitação livre até 2 caracteres
    if (numericValue.length <= 2) {
      setHours(numericValue);
      
      // Auto-avançar para minutos se digitou 2 dígitos válidos
      if (numericValue.length === 2 && parseInt(numericValue) <= 23) {
        const formattedHours = formatHours(numericValue);
        setTimeout(() => {
          setHours(formattedHours);
          minutesRef.current?.focus();
          // Posiciona o cursor no início dos minutos
          if (minutesRef.current) {
            minutesRef.current.setSelectionRange(0, 0);
          }
          // Não chama updateTime aqui para não completar com zeros
        }, 0);
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    
    // Permitir digitação livre até 2 caracteres
    if (numericValue.length <= 2) {
      setMinutes(numericValue);
      
      // Chama updateTime apenas quando terminar de digitar os minutos
      if (numericValue.length === 2 && parseInt(numericValue) <= 59) {
        const formattedMinutes = formatMinutes(numericValue);
        setTimeout(() => {
          setMinutes(formattedMinutes);
          if (hours) {
            updateTime(hours, formattedMinutes);
          }
        }, 0);
      }
    }
  };

  const handleHoursBlur = () => {
    // Verifica se está realmente saindo do componente (não indo para os minutos)
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isStayingInComponent = activeElement === minutesRef.current;
      
      if (hours) {
        const formattedHours = formatHours(hours);
        setHours(formattedHours);
        
        // Se está saindo do componente e não tem minutos, completa com zeros
        if (!isStayingInComponent && !minutes) {
          setMinutes('00');
          updateTime(formattedHours, '00');
        } else if (minutes) {
          updateTime(formattedHours, minutes);
        }
      } else if (!isStayingInComponent && !hours && !minutes) {
        if (onChange) onChange('');
      }

      if(!isStayingInComponent && minutes && !hours){
        setHours('00');
        const formattedMinutes = formatMinutes(minutes);
        updateTime('00',formattedMinutes)
      }
      
      // Chama o onBlur externo apenas quando realmente sair do componente
      if (!isStayingInComponent && onBlur) {
        onBlur(createSyntheticBlurEvent('hours'));
      }
      
      setFocusedField(null);
    }, 0);
  };

  const handleMinutesBlur = () => {
    // Verifica se está realmente saindo do componente (não voltando para as horas)
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isStayingInComponent = activeElement === hoursRef.current;
      
      if (minutes) {
        const formattedMinutes = formatMinutes(minutes);
        setMinutes(formattedMinutes);
        updateTime(hours, formattedMinutes);
      } else if (!isStayingInComponent && hours) {
        // Se está saindo do componente e tem horas mas não minutos, completa com zeros
        setMinutes('00');
        updateTime(hours, '00');
      } else if (!isStayingInComponent && !hours && !minutes) {
        if (onChange) onChange('');
      }

      // Chama o onBlur externo apenas quando realmente sair do componente
      if (!isStayingInComponent && onBlur) {
        onBlur(createSyntheticBlurEvent('minutes'));
      }
      
      setFocusedField(null);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'hours' | 'minutes') => {
    const target = e.currentTarget as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    const inputLength = target.value.length;
    
    // Navegação com seta direita
    if (e.key === 'ArrowRight') {
      if (field === 'hours' && cursorPosition >= inputLength) {
        // Se está no final das horas, sempre vai para minutos primeiro
        e.preventDefault();
        minutesRef.current?.focus();
        setTimeout(() => {
          if (minutesRef.current) {
            minutesRef.current.setSelectionRange(0, 0);
          }
        }, 0);
      } else if (field === 'minutes' && cursorPosition >= inputLength && onNavigateNext) {
        // Se está no final dos minutos e tem callback externo
        e.preventDefault();
        onNavigateNext();
      }
    } 
    
    // Navegação com seta esquerda
    else if (e.key === 'ArrowLeft') {
      if (field === 'minutes' && cursorPosition <= 0) {
        // Se está no início dos minutos, sempre vai para horas primeiro
        e.preventDefault();
        hoursRef.current?.focus();
        setTimeout(() => {
          if (hoursRef.current) {
            const hoursLength = hoursRef.current.value.length;
            hoursRef.current.setSelectionRange(hoursLength, hoursLength);
          }
        }, 0);
      } else if (field === 'hours' && cursorPosition <= 0 && onNavigatePrevious) {
        // Se está no início das horas e tem callback externo
        e.preventDefault();
        onNavigatePrevious();
      }
    }
    
    // Backspace no início dos minutos volta para horas
    if (e.key === 'Backspace' && field === 'minutes' && minutes === '' && cursorPosition === 0) {
      e.preventDefault();
      hoursRef.current?.focus();
      // Posiciona o cursor no final das horas
      setTimeout(() => {
        if (hoursRef.current) {
          const hoursLength = hoursRef.current.value.length;
          hoursRef.current.setSelectionRange(hoursLength, hoursLength);
        }
      }, 0);
    }

    if (e.key === 'Backspace' && field === 'hours' && hours === '' && cursorPosition === 0 && onNavigatePrevious) {
      e.preventDefault();
      onNavigatePrevious();
    }

    if(e.key ==='Backspace' && field === 'hours' && hours != '' && cursorPosition === 0 && onNavigatePrevious) {
      e.preventDefault();
      onNavigatePrevious();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!disabled) {
      const target = e.target as HTMLElement;
      
      // Se clicou diretamente em um dos inputs, não faz nada (deixa o comportamento padrão)
      if (target === hoursRef.current || target === minutesRef.current) {
        return;
      }
      
      // Se clicou na área geral do container
      if (!hours && !minutes) {
        hoursRef.current?.focus();
      } else if (focusedField === null) {
        hoursRef.current?.focus();
      }
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`
          inline-flex items-center
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-text'}
          ${className}
        `}
      >
        <input
          ref={hoursRef}
          type="text"
          value={hours}
          onChange={handleHoursChange}
          onBlur={handleHoursBlur}
          onFocus={() => setFocusedField('hours')}
          onKeyDown={(e) => handleKeyDown(e, 'hours')}
          placeholder={placeholderHours || '00'}
          disabled={disabled}
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288] placeholder-[#662C9288]"
          maxLength={2}
        />
        
        <span className="text-gray-600 mx-1 select-none">:</span>
        
        <input
          ref={minutesRef}
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          onBlur={handleMinutesBlur}
          onFocus={() => setFocusedField('minutes')}
          onKeyDown={(e) => handleKeyDown(e, 'minutes')}
          placeholder={placeholderMinutes || '00'}
          disabled={disabled}
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-[#662C9288] focus:border-[#662C9288] placeholder-[#662C9288]"
          maxLength={2}
        />
      </div>
    </div>
  );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
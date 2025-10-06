import { useState, useEffect } from 'react';

export default function BanamexLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const linkEstilos = document.createElement('link');
    linkEstilos.rel = 'stylesheet';
    linkEstilos.href = '/banamex/css/estilosLoginNew.css';
    document.head.appendChild(linkEstilos);

    const linkMando = document.createElement('link');
    linkMando.rel = 'stylesheet';
    linkMando.href = '/banamex/css/mando.css';
    document.head.appendChild(linkMando);

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const fechaElement = document.querySelector('.fecha');
    if (fechaElement) {
      fechaElement.textContent = today.toLocaleDateString('es-MX', options);
    }

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 4);
    }, 5000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(linkEstilos);
      document.head.removeChild(linkMando);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      setErrorMessage('Por favor ingrese su número de cliente y clave de acceso.');
      setShowError(true);
      return;
    }

    console.log('Login attempt:', { userId, password });
  };

  const handleNumericInput = (e: React.KeyboardEvent) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
      e.preventDefault();
    }
  };

  const handleAlphanumericInput = (e: React.KeyboardEvent) => {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-Z0-9]/.test(char)) {
      e.preventDefault();
    }
  };

  const closeModal = () => {
    setShowError(false);
    setShowContact(false);
  };

  const getBannerClass = () => {
    return currentBanner === 0 ? 'bg_1' : 'bg_2';
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="overlay" style={{ display: showError || showContact ? 'block' : 'none' }}></div>
      <div className="overlay_trans" style={{ display: showError || showContact ? 'block' : 'none' }}></div>
      
      <div id="contenedor">
        <div className="header">
          <div className="top" id="navegacionPrincipal">
            <p className="fecha"></p>
            <div className="menu">
              <ul>
                <li><a href="#" style={{ fontWeight: 'bold' }}>English</a></li>
                <li className="separador">|</li>
                <li>
                  <a href="#" className="flecha" style={{ fontWeight: 'bold' }}>
                    <span className="text">Sucursales</span> <span className="icono"></span>
                  </a>
                </li>
                <li className="separador">|</li>
                <li>
                  <a 
                    href="#" 
                    className="flecha con_menu" 
                    style={{ fontWeight: 'bold' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowContact(!showContact);
                    }}
                  >
                    <span className="text">Contáctanos</span> <span className="icono"></span>
                  </a>
                  {showContact && (
                    <div className="contactanos top_menu" style={{ display: 'block' }}>
                      <div className="cortina">
                        <div className="box color333">
                          <span className="bold f14">Contáctanos</span><br /><br />
                          <div className="paddingB2">
                            <span className="f16 negrita">Banamex Resuelve PyMEs</span>
                          </div>
                          <div>
                            <div className="paddingT5 paddingB1 f10 borderT_Dotted_CCCCCC"></div>
                            <div className="paddingB1 f11 negrita">Segmento Pequeña y Mediana Empresa (PYME) y Sucursal<br /></div>
                            <div>
                              <div>
                                <span className="paddingB1 f11_N negrita">CD. de México e interior de la república: </span>
                                <span className="f10">551226 8867<br /></span>
                              </div>
                              <div>
                                <span className="f11_N negrita">EUA y Canadá:</span>
                                <span className="f10"> 1 844 207 3684</span>
                              </div>
                              <div>
                                <span className="paddingB1 f11_N bold">Horarios:</span><br />
                                <span className="f10">Lunes a Viernes 07:00 a 23:00, sábado de 09:00 a 18:00<br /></span>
                              </div>
                              <div>
                                <span className="paddingB1 f11_N bold">Correo electrónico:</span>
                                <a style={{ color: 'black', textDecoration: 'underline' }} className="f10" href="mailto:servicioalclientepyme@banamex.com">
                                  servicioalclientepyme@banamex.com
                                </a>
                              </div>
                            </div>
                            <br />
                          </div>
                          <div className="paddingB2">
                            <span className="f16 negrita">Banamex Resuelve</span>
                          </div>
                          <div>
                            <div className="paddingT5 paddingB1 f10 borderT_Dotted_CCCCCC"></div>
                            <div className="paddingB1 f11 negrita">Segmento Corporativo, Empresarial y Gobierno<br /></div>
                            <div>
                              <div>
                                <span className="f11_N negrita">CD de México / interior de la república:</span>
                                <span className="f10"> 552226 1111</span>
                              </div>
                              <div>
                                <span className="f11_N negrita">EUA y Canadá:</span>
                                <span className="f10"> 1 855 295 7093</span>
                              </div>
                              <div>
                                <span className="paddingB1 f11_N negrita">Horario:</span><br />
                                <span className="f10">Lunes a Viernes 07:00 a 23:00, sábado de 09:00 a 18:00<br /></span>
                              </div>
                              <div>
                                <span className="f11_N negrita">Correo Electrónico:</span><br />
                                <a style={{ color: 'black', textDecoration: 'underline' }} className="f10" href="mailto:servicioalclientebei@banamex.com">
                                  servicioalclientebei@banamex.com
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="box_bottom"></div>
                      </div>
                    </div>
                  )}
                </li>
                <li className="separador">|</li>
                <li><a href="#" style={{ fontWeight: 'bold' }}>Ayuda</a></li>
              </ul>
            </div>
          </div>
          <div className="bottom">
            <div className="logo"></div>
            <div className="divisor_logos"></div>
            <div className="BancaNet"></div>
          </div>
        </div>

        <div className="disclaimer-container" id="divDisclaimer"></div>
        <div id="cambiaImagen1" className={currentBanner === 0 ? 'bg_2' : 'bg_1'}></div>
        <div id="cambiaImagen2" className={currentBanner === 0 ? 'bg_1' : 'bg_2'}></div>

        <div id="contenido_login">
          <div id="area_login">
            {showError && (
              <div className="modal" id="area_error" style={{ display: 'block' }}>
                <div className="top"></div>
                <div className="content">
                  <div className="padding30T15B0">
                    <div className="clear overflow">
                      <div className="close" onClick={closeModal}></div>
                    </div>
                    <div className="titulo modaltitulo">
                      <p>Acceso Denegado</p>
                    </div>
                    <div className="contenido paddingT0">
                      <div className="scroll_y height228">
                        <div className="viewport height228">
                          <div className="overview">
                            <div className="overflow paddingT10">
                              <div className="puntos">
                                <div className="titulocontenido_ico">
                                  <p><span className="normal">{errorMessage}</span></p>
                                </div>
                              </div>
                              <div className="ancho100p clear overflow paddingL20 f11 paddingT20">
                                <div className="ancho100p overflow marginAuto">
                                  <div className="f14 negrita paddingB10 color000">Banamex Resuelve PyMEs</div>
                                  <div className="f11_N paddingL20">
                                    <div>
                                      <span className="negrita f11_N">Segmento Pequeña y Mediana Empresa (PYME) y Sucursal</span>
                                    </div>
                                    <div className="f11_N">Cd. de México: 55 12 26 88 67</div>
                                    <div className="f11_N">Del Interior de la República: 55 12 26 88 67</div>
                                    <div className="f11_N">EUA y Canadá: 1 844 207 3684</div>
                                    <div className="f11_N">Horarios: De lunes a Viernes de 07:00 a 23:00, sábado de 09:00 a 18:00</div>
                                    <span className="paddingB1 f11_N negrita">Correo electrónico:</span>
                                    <a className="f11 linklogin color000" href="mailto:servicioalclientepyme@banamex.com">
                                      servicioalclientepyme@banamex.com
                                    </a>
                                  </div>
                                  <br />
                                  <div className="f14 negrita paddingB10 color000">Banamex Resuelve</div>
                                  <div className="paddingB6 f11 paddingL20">
                                    <div>
                                      <span className="negrita f11_N">Segmento Empresarial y Gobierno.</span>
                                    </div>
                                    <div className="f11_N">Cd. de México: 55 22 26 1111</div>
                                    <div className="f11_N">Del interior de la República: 55 22 26 1111</div>
                                    <div className="f11_N">EUA y Canadá: 1 855 295 7093</div>
                                    <div className="f11_N">Horario Lunes a Viernes 07:00 a 23:00, sábado de 09:00 a 18:00</div>
                                    <span className="f11_N negrita">Correo Electrónico:</span>
                                    <a className="f11 linklogin color000" href="mailto:servicioalclientebei@banamex.com">
                                      servicioalclientebei@banamex.com
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sello">
                      <p></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div id="login">
              <div className="top"></div>
              <div className="content">
                <span className="colorFFF">
                  <span className="bold">Banca</span>Net Empresarial
                </span>
                <form onSubmit={handleSubmit} className="marginT7 marginB11 form_login">
                  <span className="colorFFF">Número de cliente</span>
                  <div className="form_label">
                    <input
                      type="password"
                      maxLength={12}
                      onKeyPress={handleNumericInput}
                      autoComplete="off"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      onPaste={(e) => e.preventDefault()}
                      data-testid="input-numero-cliente"
                    />
                  </div>
                  <div className="paddingT9 colorFFF">Clave de acceso</div>
                  <div className="form_label">
                    <input
                      type="password"
                      maxLength={8}
                      onKeyPress={handleAlphanumericInput}
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onPaste={(e) => e.preventDefault()}
                      data-testid="input-clave-acceso"
                    />
                  </div>
                  <div className="marginT15">
                    <input
                      type="submit"
                      className="btn_az colorFFF"
                      value="Entrar"
                      data-testid="button-entrar"
                    />
                    <span className="candado"></span>
                  </div>
                </form>
                <p>
                  <a href="http://www.banamex.com/" className="ligas">
                    <span className="flecha"></span>
                    <span>Ir a Banamex.com</span>
                  </a>
                </p>
                <p>
                  <a href="#" className="ligas">
                    <span className="flecha"></span>
                    <span>Conoce el demo</span>
                  </a>
                </p>
                <p>
                  <a href="#" className="ligas">
                    <span className="flecha"></span>
                    <span>
                      Desbloquear claves<br />
                      <span className="marginL10"></span>de acceso
                    </span>
                  </a>
                </p>
              </div>
              <div className="bottom">
                <div className="contenidoLoginBottom"></div>
              </div>
            </div>
          </div>

          <div id="destacados">
            <div className="clear">
              <div className="destacado_avtive_flecha"></div>
            </div>
            <div id="destacado_div">
              <div 
                onClick={() => setCurrentBanner(3)} 
                className={currentBanner === 3 ? 'avtive_3' : 'destacado_3'}
                id="destacado_3"
              ></div>
              <div 
                onClick={() => setCurrentBanner(2)} 
                className={currentBanner === 2 ? 'avtive_2' : 'destacado_2'}
                id="destacado_2"
              ></div>
              <div 
                onClick={() => setCurrentBanner(1)} 
                className={currentBanner === 1 ? 'avtive_1' : 'destacado_1'}
                id="destacado_1"
              ></div>
              <div 
                onClick={() => setCurrentBanner(0)} 
                className={currentBanner === 0 ? 'avtive_0' : 'destacado_0'}
                id="destacado_0"
              ></div>
            </div>
          </div>
        </div>

        <div className="footer marginT70" id="footer">
          <div className="top">
            <p className="floatL">
              <a href="http://www.banamex.com/">Banamex.com</a>
            </p>
            <p className="floatR">
              <a href="#">Privacidad y Seguridad</a> | <a href="#">Términos y Condiciones</a>
            </p>
          </div>
          <div className="bottom">
            <p className="paddingT7">
              Banamex es una marca registrada de Citigroup Inc. utilizada bajo licencia por Banco Nacional de México, S.A.,
              integrante del Grupo Financiero Banamex.
            </p>
            <p className="paddingT7">
              © 2025 Banco Nacional de México, S.A. Derechos Reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Representa un elemento del menú lateral principal.
 * Cada opción dirige al usuario a una sección protegida de la aplicación.
 */
type MenuItem = {
  title: string;
  route: string;
  icon: string;
  active?: boolean;
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
/**
 * Componente del menú lateral de navegación.
 *
 * Responsabilidades principales:
 * - Mostrar las secciones disponibles para un usuario autenticado.
 * - Resaltar la ruta activa.
 * - Cerrar el menú al navegar.
 * - Cerrar la sesión del usuario.
 */
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [
    { title: 'Inicio', route: '/home', icon: 'home-outline', active: false },
    { title: 'Cuestionario IPAQ', route: '/ipaq', icon: 'heart-outline', active: false },
    { title: 'Artículos', route: '/articles', icon: 'newspaper-outline', active: false },
    { title: 'Mi Rutina', route: '/routine', icon: 'calendar-outline', active: false },
    { title: 'Favoritos', route: '/favorites', icon: 'star-outline', active: false },
  ];

  private sub?: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private menuCtrl: MenuController
  ) {}

  /**
   * Inicializa el estado activo del menú y se suscribe a cambios de ruta.
   */
  ngOnInit(): void {
    this.setActiveByUrl(this.router.url);
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.setActiveByUrl(e.urlAfterRedirects));
  }

  /** Libera la suscripción a eventos del router al destruir el componente. */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Navega a una ruta protegida y cierra el menú lateral.
   * @param route Ruta de destino dentro de la aplicación.
   */
  async navigateTo(route: string): Promise<void> {
    await this.router.navigateByUrl(route);
    await this.menuCtrl.close('main-menu');
  }

  /**
   * Marca visualmente la opción activa del menú según la URL actual.
   * @param url Ruta actual del navegador.
   */
  private setActiveByUrl(url: string): void {
    this.menuItems = this.menuItems.map((item) => ({
      ...item,
      active: url === item.route || url.startsWith(item.route + '/'),
    }));
  }

  /**
   * Cierra la sesión del usuario y redirige al login.
   */
  async logout(): Promise<void> {
    await this.auth.logout();
    await this.menuCtrl.close('main-menu');
    await this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}

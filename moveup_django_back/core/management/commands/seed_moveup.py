from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Profile


class Command(BaseCommand):
    help = 'Crea un usuario demo para MoveUp si no existe.'

    def handle(self, *args, **options):
        username = 'demo'
        email = 'demo@moveup.local'
        password = 'demo12345'
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': 'Demo',
                'last_name': 'MoveUp',
            },
        )
        if created:
            user.set_password(password)
            user.save()
            Profile.objects.get_or_create(user=user, defaults={'level': 'bajo'})
            self.stdout.write(self.style.SUCCESS(f'Usuario demo creado: {username} / {password}'))
        else:
            self.stdout.write(self.style.WARNING('El usuario demo ya existía.'))

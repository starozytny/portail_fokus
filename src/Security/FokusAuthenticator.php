<?php

namespace App\Security;

use App\Service\Fokus\FokusApi;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

class FokusAuthenticator extends AbstractLoginFormAuthenticator
{
    public function __construct(private readonly RouterInterface $router,
                                private readonly CsrfTokenManagerInterface $csrfTokenManager,
                                private readonly FokusApi $fokusApi)
    {}

    protected function getLoginUrl(Request $request): string
    {
        return $this->router->generate('app_login');
    }

    public function authenticate(Request $request): Passport
    {
        $username = $request->request->get('_username', null, '');
        $password = $request->request->get('_password', '');
        $csrfToken = $request->request->get('_csrf_token');

        if (!$this->csrfTokenManager->isTokenValid(new CsrfToken('authenticate', $csrfToken))) {
            throw new CustomUserMessageAuthenticationException('Invalid CSRF token.');
        }

        $this->fokusApi->setSessionData($username, $password);

        return new Passport(
            new UserBadge($username),
            new PasswordCredentials($password),
            [
                new CsrfTokenBadge('authenticate', $csrfToken)
            ]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return new RedirectResponse($this->router->generate('app_logged'));
    }
}

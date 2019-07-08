class RecordingPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user == user )
    end
  end

  def update?
    record.user == user
  end

  def destroy?
    user_is_owner_or_admin?
  end

  def create?
    true
  end

  private

  def user_is_owner_or_admin?
    record.user == user || user.admin
  end

end
